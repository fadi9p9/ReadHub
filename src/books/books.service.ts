// src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create({
      ...createBookDto,
      categories: createBookDto.categoryIds?.map(id => ({ id })) // تحويل IDs إلى كيانات
    });
    return this.bookRepository.save(book);
  }

  findAll() {
    return this.bookRepository.find({ relations: ['categories'] });
  }

  findOne(id: number) {
    return this.bookRepository.findOne({ where: { id }, relations: ['categories'] });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    // تحويل البيانات لتتناسب مع TypeORM
    const updateData: any = { ...updateBookDto };
    
    if (updateBookDto.categoryIds) {
      updateData.categories = updateBookDto.categoryIds.map(id => ({ id }));
    }
  
    await this.bookRepository.update(id, updateData);
    return this.findOne(id); // إرجاع الكتاب المحدث
  }

  remove(id: number) {
    return this.bookRepository.delete(id);
  }
}
