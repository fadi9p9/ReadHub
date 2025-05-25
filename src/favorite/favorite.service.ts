import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Book } from '../books/entities/book.entity';
import { User } from '../user/entities/user.entity';
import { PaginationFavoriteDto } from './dto/pagination-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

//   async create(createFavoriteDto: CreateFavoriteDto) {
//   const { userId, bookId } = createFavoriteDto;
//     const exists = await this.favoriteRepository.findOne({ where: { user: { id: userId }, book: { id: bookId } } });
//     if (exists) {
//         return { message: 'الكتاب موجود بالفعل في المفضلة' };
//     }
//     return this.favoriteRepository.save({ user: { id: userId }, book: { id: bookId } });
// }


async create(createFavoriteDto: CreateFavoriteDto): Promise<{ message: string, action: 'added' | 'removed' }> {
  const { userId, bookId } = createFavoriteDto;
  
  const existingFavorite = await this.favoriteRepository.findOne({
    where: {
      user: { id: userId },
      book: { id: bookId }
    },
    relations: ['user', 'book'] 
    });

  if (existingFavorite) {
    await this.favoriteRepository.remove(existingFavorite);
    return { 
      message: 'تمت إزالة الكتاب من المفضلة بنجاح',
      action: 'removed'
    };
  } else {
    const newFavorite = this.favoriteRepository.create({
      user: { id: userId },
      book: { id: bookId }
    });
    await this.favoriteRepository.save(newFavorite);
    return {
      message: 'تمت إضافة الكتاب إلى المفضلة بنجاح',
      action: 'added'
    };
  }
}
  async findAll(paginationDto: PaginationFavoriteDto): Promise<{data: Favorite[], count: number}> {
    const { limit = 10, page = 1, userId, bookId } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.user', 'user')
      .leftJoinAndSelect('favorite.book', 'book')
      .select([
        'favorite.id',
        'favorite.created_at',
        'user.id',
        'book.id',
        'book.title',
        'book.author',
        'book.img',
        'book.price',
        'book.discount',
        'book.total_pages'
      ])
      .take(limit)
      .skip(skip);

    if (userId) {
      query.andWhere('user.id = :userId', { userId });
    }

    if (bookId) {
      query.andWhere('book.id = :bookId', { bookId });
    }

    const [data, count] = await query.getManyAndCount();

    return {
      data,
      count
    };
  }

  async findOne(id: number): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
      relations: ['user', 'book'],
      select:{
        id: true,
        created_at: true,
        user: {
          id: true,
        },
        book: {
          id: true,
          title: true,
          author: true,
          img: true,
          price: true,
          discount: true,
          total_pages:true
        },
      }
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    return favorite;
  }
  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.favoriteRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No favorite found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} favorite deleted successfully`, 
      warning: 'Some favorite were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} favorite deleted successfully` 
  };
}

}