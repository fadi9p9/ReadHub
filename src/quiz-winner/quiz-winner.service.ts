import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizWinner } from './entities/quiz-winner.entity';
import { CreateQuizWinnerDto } from './dto/create-quiz-winner.dto';
import { UpdateQuizWinnerDto } from './dto/update-quiz-winner.dto';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Coupon } from '../coupon/entities/coupon.entity';

@Injectable()
export class QuizWinnersService {
  constructor(
    @InjectRepository(QuizWinner)
    private readonly quizWinnerRepository: Repository<QuizWinner>,
    
  ) {}

  async create(createQuizWinnerDto: CreateQuizWinnerDto) {
    const winnerData = {
      ...createQuizWinnerDto,
      user: { id: createQuizWinnerDto.userId }, 
      quiz: { id: createQuizWinnerDto.quizId },  
      Coupon: { id: createQuizWinnerDto.couponId }  
    };
    
    const winner = this.quizWinnerRepository.create(winnerData);
    return this.quizWinnerRepository.save(winner);
  }

  async findAllWithPaginationAndSearch(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const skip = (page - 1) * limit;

  const query = this.quizWinnerRepository
    .createQueryBuilder('winner')
    .leftJoinAndSelect('winner.quiz', 'quiz')
    .leftJoinAndSelect('winner.user', 'user')
    .leftJoinAndSelect('winner.coupon', 'coupon')
    .select([
      'winner.id',
      'winner.created_at',
      'user.id',
      'user.first_name',
      'user.last_name',
      'quiz.id',
      'quiz.title',
      'quiz.created_at',
      'coupon.id',
      'coupon.code',
      'coupon.discount_value',
    ])
    .take(limit)
    .skip(skip);

  if (search) {
    const lowerSearch = `%${search.toLowerCase()}%`;
    query.andWhere(
      `(LOWER(user.first_name) LIKE :search OR LOWER(user.last_name) LIKE :search OR LOWER(quiz.title) LIKE :search)`,
      { search: lowerSearch }
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
    return this.quizWinnerRepository.findOne({ where: { id }, relations: ['quiz', 'user', 'coupon'] ,
      select: {
        id: true,
        created_at:true,
        user: {
          id: true,
          first_name: true,
          last_name:true,
          
        },
        quiz: {
          id: true,
          title: true,
          created_at: true,
        },
        coupon: {
          id: true,
          code: true,
          discount_value: true,
          
        },
      }
    });
  }

  async update(id: number, updateQuizWinnerDto: UpdateQuizWinnerDto) {
    const updateData = {
      ...(updateQuizWinnerDto.userId && { user: { id: updateQuizWinnerDto.userId } }),
      ...(updateQuizWinnerDto.quizId && { quiz: { id: updateQuizWinnerDto.quizId } }),
      ...(updateQuizWinnerDto.couponId && { coupon: { id: updateQuizWinnerDto.couponId } })
    };
    
    await this.quizWinnerRepository.save({id, ...updateData});
    return this.findOne(id);
  }

  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.quizWinnerRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No quiz winner found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} quiz winner deleted successfully`, 
      warning: 'Some quiz winner were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} quiz winner deleted successfully` 
  };
}

}
