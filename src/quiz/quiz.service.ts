import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PaginationQuizDto } from './dto/pagination-quiz.dto';
import { Book } from '../books/entities/book.entity';
import { QuizResult } from 'src/quiz-result/entities/quiz-result.entity';
import { QuizWinner } from 'src/quiz-winner/entities/quiz-winner.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
    @InjectRepository(QuizWinner)
    private readonly quizWinnerRepository: Repository<QuizWinner>,

  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const book = await this.bookRepository.findOne({
      where: { id: createQuizDto.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const quiz = this.quizRepository.create({
      title: createQuizDto.title,
      ar_title: createQuizDto.ar_title,
      book,
    });

    return this.quizRepository.save(quiz);
  }

  async findAll(paginationDto: PaginationQuizDto) {
    const { page = 1, limit = 10, search, bookId, lang } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.book', 'book')
      .leftJoinAndSelect('quiz.questions', 'question')
      .select([
        'quiz.id',
        'quiz.title',
        'quiz.ar_title',
        'quiz.created_at',
        'quiz.updated_at',
        'book.id',
        'book.title',
        'book.ar_title',

      ])
      .take(limit)
      .skip(skip);

    if (search) {
      if (lang === 'ar') {
        query.where('quiz.ar_title LIKE :search', { search: `%${search}%` });
      } else {
        query.where('quiz.title LIKE :search', { search: `%${search}%` });
      }
    }

    if (bookId) {
      query.andWhere('quiz.bookId = :bookId', { bookId });
    }

    const [quizzes, total] = await query.getManyAndCount();

    const processedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      title: lang === 'ar' ? quiz.ar_title || quiz.title : quiz.title,
    }));

    return {
      data: processedQuizzes,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

async findOne(id: number, lang?: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['book', 'questions' ],
      select: {
        id: true,
        title: true,
        ar_title: true,
        book: {
          id: true,
          title: true,
          ar_title: true,
        },
        questions: {
          id: true,
          question_text: true,
          correct_option:true,
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (lang === 'ar') {
      return {
        ...quiz,
        title: quiz.ar_title || quiz.title,
      };
    }

    return quiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['book'],
      select:{
        id:true,
        title:true,
        ar_title:true,
        book:{
          id:true,
          title:true,
          ar_title:true,
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (updateQuizDto.title) {
      quiz.title = updateQuizDto.title;
    }

    if (updateQuizDto.ar_title) {
      quiz.ar_title = updateQuizDto.ar_title;
    }

    if (updateQuizDto.bookId) {
      const book = await this.bookRepository.findOne({
        where: { id: updateQuizDto.bookId },
      });

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      quiz.book = book;
    }

    return this.quizRepository.save(quiz);
  }

 async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.quizRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No quizzes found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} quizzes deleted successfully`, 
      warning: 'Some quizzes were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} quizzes deleted successfully` 
  };
}

async getAllFormatted() {
  const quiz = await this.quizRepository.find();

  return quiz.map(quiz => ({
    id: quiz.id,
    title: {
      en: quiz.title,
      ar: quiz.ar_title,
    },
  }));
}

async getUserQuizzesWithResults(
  userId: number,
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const skip = (page - 1) * limit;

  const quizzesQuery = this.quizRepository.createQueryBuilder('quiz')
    .leftJoinAndSelect('quiz.book', 'book')
    .leftJoinAndSelect('quiz.questions', 'questions')
    .leftJoinAndSelect('quiz.results', 'results')
    .leftJoinAndSelect('results.user', 'user')
    .where('results.user.id = :userId', { userId })
    .take(limit)
    .skip(skip);

  if (search) {
    quizzesQuery.andWhere(
      '(quiz.title LIKE :search OR quiz.ar_title LIKE :search OR book.title LIKE :search OR book.ar_title LIKE :search)',
      { search: `%${search}%` }
    );
  }

  const [quizzes, totalQuizzes] = await quizzesQuery.getManyAndCount();

  const [results, totalResults] = await this.quizResultRepository.findAndCount({
    where: { user: { id: userId } },
    relations: ['quiz'],
    take: limit,
    skip,
    order: { created_at: 'DESC' }
  });

  const [winners, totalWinners] = await this.quizWinnerRepository.findAndCount({
    where: { user: { id: userId } },
    relations: ['quiz', 'coupon'],
    take: limit,
    skip,
    order: { created_at: 'DESC' }
  });

  const processQuestions = (questions) => {
    return questions?.map(q => ({
      id: q.id,
      question_text: q.question_text?.replace(/\\"/g, '"') || null,
    })) || [];
  };

  const processResults = (results) => {
    return results?.filter(r => r.user?.id === userId)
      .map(r => ({
        id: r.id,
        user: {
          id: r.user?.id,
          fullName: `${r.user?.first_name || ''} ${r.user?.last_name || ''}`.trim(),
          email: r.user?.email || null
        },
        total_correct: r.total_correct,
        total_questions: r.total_questions,
        created_at: r.created_at
      })) || [];
  };

  return {
    quizzes: quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      ar_title: quiz.ar_title,
      book: {
        id: quiz.book?.id,
        title: quiz.book?.title,
        ar_title: quiz.book?.ar_title
      },
      questions: processQuestions(quiz.questions),
      results: processResults(quiz.results)
    })),
    results: results.map(r => ({
      id: r.id,
      quiz: {
        id: r.quiz?.id,
        title: r.quiz?.title
      },
      total_correct: r.total_correct,
      total_questions: r.total_questions,
      created_at: r.created_at
    })),
    winners: winners.map(w => ({
      id: w.id,
      quiz: {
        id: w.quiz?.id,
        title: w.quiz?.title
      },
      coupon: {
        id: w.coupon?.id,
        code: w.coupon?.code
      },
      created_at: w.created_at
    })),
    pagination: {
      totalQuizzes,
      totalResults,
      totalWinners,
      currentPage: page,
      totalPages: Math.ceil(Math.max(totalQuizzes, totalResults, totalWinners) / limit),
      limit
    }
  };
}
}