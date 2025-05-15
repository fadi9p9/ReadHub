import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookQuestion } from './entities/book-question.entity';
import { CreateBookQuestionDto } from './dto/create-book-question.dto';
import { UpdateBookQuestionDto } from './dto/update-book-question.dto';

@Injectable()
export class BookQuestionsService {
  save(arg0: number, updateBookQuestionDto: UpdateBookQuestionDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(BookQuestion)
    private readonly bookQuestionRepository: Repository<BookQuestion>,
  ) {}

  create(createBookQuestionDto: CreateBookQuestionDto) {
    const question = this.bookQuestionRepository.create(createBookQuestionDto);
    return this.bookQuestionRepository.save(question);
  }

  findAll() {
    return this.bookQuestionRepository.find({ relations: ['quiz'] });
  }

  findOne(id: number) {
    return this.bookQuestionRepository.findOne({ where: { id }, relations: ['quiz'] });
  }

  update(id: number, updateBookQuestionDto: UpdateBookQuestionDto) {
    return this.bookQuestionRepository.save({
      id,
      ...updateBookQuestionDto
    });
  }
 async remove(id: number) {
    const result= this.bookQuestionRepository.delete(id);
     if ((await result).affected === 0) {
    throw new NotFoundException(`book_question with ID ${id} not found`);
  }
  
  return { message: 'book_question deleted successfully' };
}
 }
