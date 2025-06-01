import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
 import { Brackets, Repository } from 'typeorm';
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


  async findAllWithPaginationAndSearch(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const skip = (page - 1) * limit;

  const query = this.questionAnswerRepository
    .createQueryBuilder('answer')
    .leftJoinAndSelect('answer.question', 'question')
    .leftJoinAndSelect('question.book', 'book')
    .leftJoinAndSelect('answer.user', 'user')
    .select([
      'answer.id',
      'answer.isCorrect',
      'question.id',
      'question.question_text',
      'book.id',
      'book.title',
      'user.id',
      'user.first_name',
      'user.last_name',
    ])
    .take(limit)
    .skip(skip);

  if (search) {
    const lowerSearch = `%${search.toLowerCase()}%`;

    query.andWhere(
      new Brackets(qb => {
        qb.where('LOWER(question.question_text) LIKE :search', { search: lowerSearch })
          .orWhere('LOWER(user.first_name) LIKE :search', { search: lowerSearch })
          .orWhere('LOWER(user.last_name) LIKE :search', { search: lowerSearch })
          .orWhere('LOWER(book.title) LIKE :search', { search: lowerSearch });
      })
    );
  }

  const [answers, total] = await query.getManyAndCount();

  return {
    data: answers,
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