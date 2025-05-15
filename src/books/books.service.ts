import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import * as fs from 'fs';
import * as path from 'path';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(
  createBookDto: CreateBookDto,
  img?: Express.Multer.File,
  pdf?: Express.Multer.File
) {
  const book = this.bookRepository.create(createBookDto);

  if (img) {
    book.img = book.img = `/uploads/images/${img.filename}`;
  }

  if (pdf) {
    book.pdf = `/uploads/pdfs/${pdf.filename}`;
  }

  return this.bookRepository.save(book);
}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Book[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto; 
    const [data, total] = await this.bookRepository.findAndCount({
      relations: ['categories'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(
  id: number,
  updateBookDto: UpdateBookDto,
  img?: Express.Multer.File,
  pdf?: Express.Multer.File
) {
  const book = await this.bookRepository.findOne({ where: { id } });

  if (!book) {
    throw new Error('Book not found');
  }

  book.title = updateBookDto.title ?? book.title;
  book.description = updateBookDto.description ?? book.description;

  if (img) {
    book.img = book.img = `/uploads/images/${img.filename}`;
  }

  if (pdf) {
    book.pdf = `/uploads/pdfs/${pdf.filename}`;
  }

  return this.bookRepository.save(book);
}
  async remove(id: number): Promise<void> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.img) {
      const imagePath = path.join(__dirname, '..', '..', '_uploads', 'images', path.basename(book.img));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if (book.pdf) {
      const pdfPath = path.join(__dirname, '..', '..', '_uploads', 'pdfs', path.basename(book.pdf));
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await this.bookRepository.delete(id);
  }
}
