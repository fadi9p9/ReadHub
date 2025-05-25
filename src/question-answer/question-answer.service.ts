import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
import { QuestionAnswer } from './entities/question-answer.entity';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question-answer.dto';
import { User } from 'src/user/entities/user.entity';
import { BookQuestion } from 'src/book-question/entities/book-question.entity';

@Injectable()
export class QuestionAnswersService {
  repository: any;
  constructor(
    @InjectRepository(QuestionAnswer)
    private readonly questionAnswerRepository: Repository<QuestionAnswer>,
      @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(BookQuestion)
  private readonly questionRepository: Repository<BookQuestion>,
  ) {}

  async create(dto: CreateQuestionAnswerDto) {
  const answer = this.questionAnswerRepository.create({
    isCorrect: Boolean(dto.isCorrect),
  });

  if (dto.questionId) {
    const question = await this.questionRepository.findOneBy({ id: dto.questionId });
    if (!question) throw new NotFoundException('Question not found');
    answer.question = question;
  }

  if (dto.userId) {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');
    answer.user = user;
  }

  return await this.questionAnswerRepository.save(answer);
}


  findAll() {
    return this.questionAnswerRepository.find({ 
      relations: ['question', 'user'] ,
      select: {
        id: true,
        isCorrect: true,
        question: {
          id: true,
          question_text: true,
          book: {
            id: true,
            title: true,
           
          },
        },
        user: {
          id: true,
          first_name: true,
          last_name: true,
        },
      }
    });
  }

  findOne(id: number) {
    return this.questionAnswerRepository.findOne({ 
      where: { id }, 
      relations: ['question', 'user'] ,
      select: {
        id: true,
        isCorrect: true,
        question: {
          id: true,
          question_text: true,
          book: {
            id: true,
            title: true,

          },
        },
        user: {
          id: true,
          first_name: true,
          last_name: true,
        },
      }
    });
  }

  
async update(id: number, dto: UpdateQuestionAnswerDto) {
  const answer = await this.questionAnswerRepository.findOne({ where: { id }, relations: ['question', 'user'] });
  if (!answer) throw new NotFoundException('Answer not found');

  if (dto.isCorrect !== undefined) {
    answer.isCorrect = Boolean(dto.isCorrect);
  }

  if (dto.questionId) {
    const question = await this.questionRepository.findOneBy({ id: dto.questionId });
    if (!question) throw new NotFoundException('Question not found');
    answer.question = question;
  }

  if (dto.userId) {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');
    answer.user = user;
  }

    if(dto.selected_option){
      answer.selected_option = dto.selected_option;
    }

  return this.questionAnswerRepository.save(answer);
}

 async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.questionAnswerRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No questionAnswer found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} questionAnswer deleted successfully`, 
      warning: 'Some questionAnswer were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} questionAnswer deleted successfully` 
  };
}

}