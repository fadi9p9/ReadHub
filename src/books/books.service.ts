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
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/user.service';
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  book.rating = createBookDto.rating || 0;
  book.userId = createBookDto.userId || null;
  book.isFree = createBookDto.isFree || false;
  
  if (image) book.img = `/uploads/images/${image.filename}`;
  if (file) book.pdf = `/uploads/pdfs/${file.filename}`;

  if (createBookDto.categoryIds) {
    book.categories = await this.categoryRepository.findByIds(
      createBookDto.categoryIds,
    );
  }

  await this.calculateAndUpdateDiscountedPrice(book);
  
  return await this.bookRepository.save(book);
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
      if(limit!=-1){
    query.take(limit).skip(skip);
      }
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
  async findComment(id: number, lang?: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: {
        comments: {
          user: true,
          replies: {
            user: true
          },
          likes: {
            user: true
          }
        }
      },
      select: {
        id: true,
        title: true,
        comments: {
          id: true,
          text: true,
          created_at: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
            img: true
          },
          replies: {
            id: true,
            text: true,
            created_at: true,
            user: {
              id: true,
              first_name: true,
              last_name: true,
              img: true,
            }
          },
          likes: {
            id: true,
            user: {
              id: true,
              first_name: true,
              last_name: true,
            }
          }
        }
      }
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

  if (updateBookDto.price !== undefined || updateBookDto.discount !== undefined) {
    await this.calculateAndUpdateDiscountedPrice(book);
  }
  
  return await this.bookRepository.save(book);
}
  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.bookRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No books found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} books deleted successfully`, 
      warning: 'Some books were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} books deleted successfully` 
  };
}
private async calculateAndUpdateDiscountedPrice(book: Book): Promise<Book> {
  const discountedPrice = book.price * (1 - (book.discount / 100));
  
  book.discounted_price = parseFloat(discountedPrice.toFixed(2));
  
  return book;
}
async addRating(bookId: number, newRating: number): Promise<Book> {
  const book = await this.bookRepository.findOne({ where: { id: bookId } });
  if (!book) throw new NotFoundException(`Book with ID ${bookId} not found`);

  const currentAverage = book.rating || 0;
  const currentCount = book.rating_count || 0;

  const newAverage = (currentAverage * currentCount + newRating) / (currentCount + 1);

  book.rating = parseFloat(newAverage.toFixed(2));
  book.rating_count = currentCount + 1;

  return this.bookRepository.save(book);
}

async addCategories(bookId: number, categoryIds: number[]): Promise<Book> {
  const book = await this.bookRepository.findOne({
    where: { id: bookId },
    relations: ['categories'],
    select: {
      categories: {
        id: true,
        title: true,
      },
      id: true,
      title: true,

    }
  });

  if (!book) {
    throw new NotFoundException(`Book with ID ${bookId} not found`);
  }

  const categories = await this.categoryRepository.findByIds(categoryIds);
  book.categories = [...book.categories, ...categories];

  return this.bookRepository.save(book);
}


async updateCategories(bookId: number, categoryIds: number[]): Promise<Book> {
  const book = await this.bookRepository.findOne({
    where: { id: bookId },
    relations: ['categories'],
  });

  if (!book) {
    throw new NotFoundException(`Book with ID ${bookId} not found`);
  }

  const categories = await this.categoryRepository.findByIds(categoryIds);
  book.categories = categories;

  return this.bookRepository.save(book);
}

async removeCategories(bookId: number, categoryIds: number[]): Promise<Book> {
  const book = await this.bookRepository.findOne({
    where: { id: bookId },
    relations: ['categories'],
  });

  if (!book) {
    throw new NotFoundException(`Book with ID ${bookId} not found`);
  }

  book.categories = book.categories.filter(
    category => !categoryIds.includes(category.id)
  );

  return this.bookRepository.save(book);
}

 async checkIfBooksAreFree(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.isSubscribed) return false;

    if (user.subscriptionEndsAt && new Date() > user.subscriptionEndsAt) {
      return false;
    }

    return true;
  }

  async getSubscribedBooks(userId: number): Promise<any[]> {
    const isFree = await this.checkIfBooksAreFree(userId);
    const books = await this.bookRepository.find();

    return books.map(book => ({
      ...book,
      finalPrice: isFree ? 0 : book.price,
    }));
  }

  async getAllFormatted() {
  const book = await this.bookRepository.find();

  return book.map(book => ({
    id: book.id,
    title: {
      en: book.title,
      ar: book.ar_title,
    },
  }));
}

async findBooksByAuthorId(authorId: number): Promise<Book[]> {
  return this.bookRepository.find({
    where: { userId: authorId },
    relations: ['categories'], 
    order: { created_at: 'DESC' },
  });
}
  


async getRecommendedBooks(bookId: number, limit: number = 5): Promise<Book[]> {
  const baseBook = await this.bookRepository.findOne({
    where: { id: bookId },
    relations: ['categories'],
  });

  if (!baseBook) {
    throw new NotFoundException(`Book with ID ${bookId} not found`);
  }

  const baseCategoryIds = baseBook.categories.map(c => c.id);

  const query = this.bookRepository.createQueryBuilder('book')
    .leftJoinAndSelect('book.categories', 'category')
    .where('book.id != :bookId', { bookId })
    .orderBy('book.rating', 'DESC')
    .addOrderBy('book.created_at', 'DESC')
    .take(limit);

  if (baseCategoryIds.length > 0) {
    query
      .andWhere('category.id IN (:...categoryIds)', { categoryIds: baseCategoryIds })
      .addSelect(
        `(SELECT COUNT(*) FROM book_categories bc WHERE bc.bookId = book.id AND bc.categoryId IN (:...categoryIds))`,
        'common_categories_count'
      )
      .addOrderBy('common_categories_count', 'DESC');
  }

  if (baseBook.userId) {
    query.orWhere('book.userId = :userId', { userId: baseBook.userId });
  }

  const recommendedBooks = await query.getMany();

  if (recommendedBooks.length < limit) {
    const additionalBooks = await this.bookRepository.createQueryBuilder('book')
      .where('book.id NOT IN (:...ids)', { ids: [bookId, ...recommendedBooks.map(b => b.id)] })
      .orderBy('RAND()')
      .take(limit - recommendedBooks.length)
      .getMany();

    recommendedBooks.push(...additionalBooks);
  }

  return recommendedBooks;
}

}