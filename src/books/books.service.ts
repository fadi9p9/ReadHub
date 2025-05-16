import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

   private parseCategoryIds(categoryIds: any): number[] {
    if (!categoryIds) return [];
    
    const idsArray = Array.isArray(categoryIds)
      ? categoryIds
      : String(categoryIds).split(',');

    return idsArray
      .map(id => parseInt(String(id).trim(), 10))
      .filter(id => !isNaN(id) && id > 0);
  }

  async create(
    createBookDto: CreateBookDto,
    image?: Express.Multer.File,
    file?: Express.Multer.File,
  ) {
    const book = new Book();
    
    book.title = createBookDto.title;
    book.description = createBookDto.description || null;

    book.ar_title = createBookDto.ar_title || null;
    book.ar_description = createBookDto.ar_description || null;

    book.author = createBookDto.author;
    book.price = createBookDto.price;
    book.discount = createBookDto.discount || 0;

    book.total_pages = createBookDto.total_pages || 0;
    book.rating_count = createBookDto.rating_count || 0;
    book.total_ratings = createBookDto.total_ratings || 0;
    book.rating = createBookDto.rating || 0;

    if (image) book.img = `/uploads/${image.filename}`;
    if (file) book.pdf = `/uploads/${file.filename}`;

    if (createBookDto.categoryIds) {
      book.categories = await this.categoryRepository.findByIds(
        createBookDto.categoryIds,
      );
    }

    return await this.bookRepository.save(book);
  }

 
async findAll(paginationDto: PaginationDto) {
    const {
        search,
        minPrice,
        maxPrice,
        minRating,
        categoryIds,
        newest,
        highestRated,
        lang,
        page = 1,
        limit = 10,
    } = paginationDto;

    const skip = (page - 1) * limit;
    const query = this.bookRepository.createQueryBuilder('book')
        .leftJoinAndSelect('book.categories', 'category');

    if (search) {
        if (lang === 'ar') {
            query.where(
                '(book.ar_title LIKE :search OR book.ar_description LIKE :search OR book.author LIKE :search)',
                { search: `%${search}%` },
            );
        } else {
            query.where(
                '(book.title LIKE :search OR book.description LIKE :search OR book.author LIKE :search)',
                { search: `%${search}%` },
            );
        }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.andWhere('book.price BETWEEN :minPrice AND :maxPrice', {
            minPrice: minPrice || 0,
            maxPrice: maxPrice || 999999,
        });
    }

    if (minRating !== undefined) {
        query.andWhere('book.rating >= :minRating', { minRating });
    }


    const categories = this.parseCategoryIds(categoryIds);
    if (categories.length > 0) {
      query.andWhere('category.id IN (:...categories)', { categories });
    }

    if (newest) {
        query.orderBy('book.created_at', 'DESC');
    } else if (highestRated) {
        query.orderBy('book.rating', 'DESC');
    }

    query.take(limit).skip(skip);

    const [books, total] = await query.getManyAndCount();

    const processedBooks = books.map((book) => {
        if (lang === 'ar') {
            return {
                ...book,
                title: book.ar_title || book.title,
                description: book.ar_description || book.description,
            };
        }
        return book;
    });

    return {
        data: processedBooks,
        meta: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
        },
    };
}


  async findOne(id: number, lang?: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (lang === 'ar') {
      return {
        ...book,
        title: book.ar_title || book.title,
        description: book.ar_description || book.description,
      };
    }

    return book;
  }

  async update(
    id: number,
    updateBookDto: UpdateBookDto,
    image?: Express.Multer.File,
    file?: Express.Multer.File,
  ) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (updateBookDto.title) book.title = updateBookDto.title;
    if (updateBookDto.description !== undefined)
      book.description = updateBookDto.description;

    if (updateBookDto.ar_title !== undefined)
      book.ar_title = updateBookDto.ar_title;
    if (updateBookDto.ar_description !== undefined)
      book.ar_description = updateBookDto.ar_description;

    if (updateBookDto.author) book.author = updateBookDto.author;
    if (updateBookDto.price) book.price = updateBookDto.price;
    if (updateBookDto.discount !== undefined)
      book.discount = updateBookDto.discount;

    if (updateBookDto.total_pages !== undefined)
      book.total_pages = updateBookDto.total_pages;
    if (updateBookDto.rating_count !== undefined)
      book.rating_count = updateBookDto.rating_count;
    if (updateBookDto.total_ratings !== undefined)
      book.total_ratings = updateBookDto.total_ratings;
    if (updateBookDto.rating !== undefined) book.rating = updateBookDto.rating;

    if (image) {
      if (book.img) {
        const imagePath = path.join(
          process.cwd(),
          'uploads',
          path.basename(book.img),
        );
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      book.img = `/uploads/${image.filename}`;
    }

    if (file) {
      if (book.pdf) {
        const pdfPath = path.join(
          process.cwd(),
          'uploads',
          path.basename(book.pdf),
        );
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      }
      book.pdf = `/uploads/${file.filename}`;
    }

    if (updateBookDto.categoryIds) {
      book.categories = await this.categoryRepository.findByIds(
        updateBookDto.categoryIds,
      );
    }

    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.img) {
      const imagePath = path.join(
        process.cwd(),
        'uploads',
        path.basename(book.img),
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if (book.pdf) {
      const pdfPath = path.join(process.cwd(), 'uploads', path.basename(book.pdf));
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await this.bookRepository.delete(id);
    return { message: 'Book deleted successfully' };
  }
}