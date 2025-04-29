// src/quiz-winners/quiz-winners.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizWinner } from './entities/quiz-winner.entity';
import { CreateQuizWinnerDto } from './dto/create-quiz-winner.dto';
import { UpdateQuizWinnerDto } from './dto/update-quiz-winner.dto';

@Injectable()
export class QuizWinnersService {
  constructor(
    @InjectRepository(QuizWinner)
    private readonly quizWinnerRepository: Repository<QuizWinner>,
  ) {}

  async create(createQuizWinnerDto: CreateQuizWinnerDto) {
    const winnerData = {
      ...createQuizWinnerDto,
      user: { id: createQuizWinnerDto.userId },  // تحويل العلاقة
      quiz: { id: createQuizWinnerDto.quizId }  // تحويل العلاقة
    };
    
    const winner = this.quizWinnerRepository.create(winnerData);
    return this.quizWinnerRepository.save(winner);
  }

  findAll() {
    return this.quizWinnerRepository.find({ relations: ['quiz', 'user', 'coupon'] });
  }

  findOne(id: number) {
    return this.quizWinnerRepository.findOne({ where: { id }, relations: ['quiz', 'user', 'coupon'] });
  }

  async update(id: number, updateQuizWinnerDto: UpdateQuizWinnerDto) {
    const updateData = {
      ...(updateQuizWinnerDto.userId && { user: { id: updateQuizWinnerDto.userId } }),
      ...(updateQuizWinnerDto.quizId && { quiz: { id: updateQuizWinnerDto.quizId } })
    };
    
    await this.quizWinnerRepository.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.quizWinnerRepository.delete(id);
  }
}
