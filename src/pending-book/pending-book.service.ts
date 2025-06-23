import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingBook } from './entities/pending-book.entity';
import { CreatePendingBookDto } from './dto/create-pending-book.dto';
import { Book } from '../books/entities/book.entity';
import { Category } from '../categories/entities/category.entity';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Notification } from 'src/notification/entities/notification.entity';

@Injectable()
export class PendingBooksService {
  constructor(
    @InjectRepository(PendingBook)
    private readonly pendingBookRepository: Repository<PendingBook>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly notificationService: NotificationService,
    @InjectRepository (User)
    private readonly userRepo: Repository<User>,
    @InjectRepository (Notification)
    private readonly notificationRepo: Repository<Notification>
  ) {}

async create(dto: CreatePendingBookDto, image?: Express.Multer.File, file?: Express.Multer.File) {
  const pendingBook = this.pendingBookRepository.create(dto);

  if (image) {
    pendingBook.img = image.filename;
  }
  if (file) {
    pendingBook.pdf = file.filename;
  }

  const saved = await this.pendingBookRepository.save(pendingBook);

  await this.notificationService.notifyAdmins(`تم إرسال كتاب جديد بعنوان: ${pendingBook.title} للمراجعة.`);

  return saved;
}



 async findAll(page = 1, limit = 10, search?: string) {
  const skip = (page - 1) * limit;

  const query = this.pendingBookRepository
    .createQueryBuilder('pendingBook')
    .leftJoinAndSelect('pendingBook.author', 'user')
    .orderBy('pendingBook.created_at', 'DESC')
    .skip(skip)
    .take(limit)
    .select([
      'pendingBook.id',
      'pendingBook.title',
      'pendingBook.description',
      'pendingBook.ar_title',
      'pendingBook.ar_description',
      'pendingBook.img',
      'pendingBook.pdf',
      'pendingBook.price',
      'pendingBook.discount',
      'pendingBook.total_pages',
      'pendingBook.status',
      'pendingBook.created_at',
      'user.id',
      'user.first_name',
      'user.last_name',
      'user.email',
      'user.role',
    ]);

  if (search) {
    query.andWhere(
      `(CONCAT(user.first_name, ' ', user.last_name) LIKE :search)`,
      { search: `%${search}%` },
    );
  }

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}



  async findOne(id: number) {
    const pendingBook = await this.pendingBookRepository.findOne({ where: { id } });
    if (!pendingBook) throw new NotFoundException('الكتاب المعلق غير موجود');
    return pendingBook;
  }

  async approve(id: number) {
    const pendingBook = await this.findOne(id);

    const book = this.bookRepository.create({
  title: pendingBook.title,
  ar_title: pendingBook.ar_title,
  description: pendingBook.description,
  ar_description: pendingBook.ar_description,
  img: pendingBook.img,
  pdf: pendingBook.pdf,
  price: pendingBook.price,
  discount: pendingBook.discount,
  rating: pendingBook.rating,
  rating_count: pendingBook.rating_count,
  total_pages: pendingBook.total_pages,
  discounted_price: pendingBook.discounted_price,
  isFree: pendingBook.isFree,
  userId: pendingBook.userId,
});


    const savedBook = await this.bookRepository.save(book);

    await this.pendingBookRepository.delete(id);

    const notificationDto: CreateNotificationDto = {
      userId: pendingBook.userId,
      message: `تمت الموافقة على كتابك: ${pendingBook.title}`,
      type: 'BOOK_APPROVED',
    };
    await this.notificationService.create(notificationDto);

    return savedBook;
  }

  async reject(id: number, reason: string) {
    const pendingBook = await this.findOne(id);

    pendingBook.status = 'rejected';
    pendingBook.rejection_reason = reason;

    await this.pendingBookRepository.save(pendingBook);

    const notificationDto: CreateNotificationDto = {
      userId: pendingBook.userId,
      message: `تم رفض كتابك: ${pendingBook.title}. السبب: ${reason}`,
      type: 'BOOK_REJECTED',
    };
    await this.notificationService.create(notificationDto);

    return { message: 'تم رفض الكتاب بنجاح' };
  }

  async keepPending(id: number) {
    const pendingBook = await this.findOne(id);

    pendingBook.status = 'pending';

    await this.pendingBookRepository.save(pendingBook);

    const notificationDto: CreateNotificationDto = {
      userId: pendingBook.userId,
      message: `تم إبقاء حالة كتابك معلقة: ${pendingBook.title}`,
      type: 'BOOK_PENDING',
    };
    await this.notificationService.create(notificationDto);

    return { message: 'تم إبقاء حالة الكتاب معلقة' };
  }

  async deleteMany(ids: number[]) {
  const deleteResult = await this.pendingBookRepository.delete(ids);
  return {
    message: 'تم حذف الكتب بنجاح',
    deletedCount: deleteResult.affected || 0,
  };
}

}
