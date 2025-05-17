import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PaginationQuizDto } from './dto/pagination-quiz.dto';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
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
      .leftJoinAndSelect('quiz.questions', 'questions')
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
      relations: ['book', 'questions'],
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

  async remove(id: number) {
    const result = await this.quizRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Quiz not found');
    }

    return { message: 'Quiz deleted successfully' };
  }
}