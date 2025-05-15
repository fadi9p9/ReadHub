import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,) {}

  async create(createQuizDto: CreateQuizDto) {
    const quiz = this.quizRepository.create();

    quiz.title = createQuizDto.title;

    if (createQuizDto.bookId) {
      const book = await this.bookRepository.findOne({
        where: { id: createQuizDto.bookId },
      });

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      quiz.book = book;
    }

    return this.quizRepository.save(quiz);
  }

  findAll() {
    return this.quizRepository.find({
      relations: ['book', 'questions'],
    });
  }

  findOne(id: number) {
    return this.quizRepository.findOne({
      where: { id },
      relations: ['book', 'questions'],
    });
  }

  async update(id: number, dto: UpdateQuizDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['book'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (dto.title) {
      quiz.title = dto.title;
    }

    if (dto.bookId) {
      const book = await this.bookRepository.findOne({
        where: { id: dto.bookId },
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
