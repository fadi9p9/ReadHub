// src/quizzes/quizzes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  create(createQuizDto: CreateQuizDto) {
    const quiz = this.quizRepository.create(createQuizDto);
    return this.quizRepository.save(quiz);
  }

  findAll() {
    return this.quizRepository.find({ relations: ['book', 'questions'] });
  }

  findOne(id: number) {
    return this.quizRepository.findOne({ where: { id }, relations: ['book', 'questions'] });
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return this.quizRepository.update(id, updateQuizDto);
  }

  remove(id: number) {
    return this.quizRepository.delete(id);
  }
}
