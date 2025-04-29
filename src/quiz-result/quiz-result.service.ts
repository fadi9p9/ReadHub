// src/quiz-results/quiz-results.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizResult } from './entities/quiz-result.entity';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';

@Injectable()
export class QuizResultsService {
  constructor(
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
  ) {}

  create(createQuizResultDto: CreateQuizResultDto) {
    const result = this.quizResultRepository.create(createQuizResultDto);
    return this.quizResultRepository.save(result);
  }

  findAll() {
    return this.quizResultRepository.find({ relations: ['quiz', 'user'] });
  }

  findOne(id: number) {
    return this.quizResultRepository.findOne({ where: { id }, relations: ['quiz', 'user'] });
  }

  update(id: number, updateQuizResultDto: UpdateQuizResultDto) {
    return this.quizResultRepository.update(id, updateQuizResultDto);
  }

  remove(id: number) {
    return this.quizResultRepository.delete(id);
  }
}
