import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { Cart } from '../carts/entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Coupon } from '../coupon/entities/coupon.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async getGeneralStatistics() {
    const [
      books_count,
      carts_sold_count,
      users_count,
      competitions_count,
      coupons_count
    ] = await Promise.all([
      this.bookRepository.count(),
      this.cartRepository.count({ where: { status: 'paid' } }),
      this.userRepository.count(),
      this.quizRepository.count(),
      this.couponRepository.count()
    ]);

    const plans_count = 2;

    return {
      books_count,
      carts_sold_count,
      users_count,
      competitions_count,
      plans_count,
      coupons_count
    };
  }

  async getUserStatistics(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['carts', 'books']
    });

    if (!user) {
      return ('User not found');
    }

    const user_books_count = user.books?.length || 0;

    const user_purchased_carts = user.carts?.filter(cart => cart.status === 'paid').length || 0;

    const user_created_books_count = await this.bookRepository.count({
      where: { userId }
    });

    return {
      user_books_count,
      user_purchased_carts_count: user_purchased_carts,
      user_created_books_count
    };
  }
}