import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { QuizResult } from './entities/quiz-result.entity';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';
import { Quiz } from '../quiz/entities/quiz.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class QuizResultsService {
  constructor(
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,

    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createQuizResultDto: CreateQuizResultDto) {
    const { total_correct,total_questions, quizId, userId } = createQuizResultDto;

    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = this.quizResultRepository.create({
      total_correct,
      total_questions,
      quiz,
      user,
    });

    return this.quizResultRepository.save(result);
  }

  async findAllWithPaginationAndSearch(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const skip = (page - 1) * limit;

  const query = this.quizResultRepository
    .createQueryBuilder('result')
    .leftJoinAndSelect('result.quiz', 'quiz')
    .leftJoinAndSelect('result.user', 'user')
    .select([
      'result',
      'user.id',
      'user.first_name',
      'user.last_name',
      'quiz.id',
      'quiz.title',
      'quiz.created_at',
    ])
    .take(limit)
    .skip(skip);

  if (search) {
    const lowerSearch = `%${search.toLowerCase()}%`;
    query.andWhere(
      new Brackets(qb => {
        qb.where('LOWER(user.first_name) LIKE :search', { search: lowerSearch })
          .orWhere('LOWER(user.last_name) LIKE :search', { search: lowerSearch })
          .orWhere('LOWER(quiz.title) LIKE :search', { search: lowerSearch });
      })
    );
  }

  const [results, total] = await query.getManyAndCount();

  return {
    data: results,
    meta: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      has_previous_page: page > 1,
      has_next_page: page < Math.ceil(total / limit),
      previous_page: page > 1 ? page - 1 : null,
      next_page: page < Math.ceil(total / limit) ? page + 1 : null,
    },
  };
}


  findOne(id: number) {
    return this.quizResultRepository.findOne({ where: { id }, relations: ['quiz', 'user'] });
  }

  async update(id: number, updateQuizResultDto: UpdateQuizResultDto) {
  const result = await this.quizResultRepository.findOne({ where: { id } });
  if (!result) throw new NotFoundException('QuizResult not found');

  const { quizId, userId, total_correct, total_questions } = updateQuizResultDto;

  if (quizId) {
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    result.quiz = quiz;
  }

  if (userId) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    result.user = user;
  }

  if (total_correct !== undefined) result.total_correct = total_correct;
  if (total_questions !== undefined) result.total_questions = total_questions;

  return this.quizResultRepository.save(result);
}

 async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.quizResultRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No quiz result found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} quiz result deleted successfully`, 
      warning: 'Some quiz result were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} quiz result deleted successfully` 
  };
}

}
