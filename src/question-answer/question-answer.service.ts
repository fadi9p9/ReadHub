import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionAnswer } from './entities/question-answer.entity';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question-answer.dto';

@Injectable()
export class QuestionAnswersService {
  repository: any;
  constructor(
    @InjectRepository(QuestionAnswer)
    private readonly questionAnswerRepository: Repository<QuestionAnswer>,
  ) {}

  async create(dto: CreateQuestionAnswerDto) {
    const answer = this.repository.create({
      isCorrect: Boolean(dto.isCorrect)
    });
    return await this.repository.save(answer);
  }

  findAll() {
    return this.questionAnswerRepository.find({ 
      relations: ['question', 'user'] 
    });
  }

  findOne(id: number) {
    return this.questionAnswerRepository.findOne({ 
      where: { id }, 
      relations: ['question', 'user'] 
    });
  }

  
async update(id: number, dto: UpdateQuestionAnswerDto) {
  await this.repository.update(id, {
    isCorrect: dto.isCorrect !== undefined ? Boolean(dto.isCorrect) : undefined
  });
  return this.findOne(id);
}
//
  remove(id: number) {
    return this.questionAnswerRepository.delete(id);
  }
}