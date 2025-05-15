import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Book } from '../books/entities/book.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
  const { userId, bookId } = createFavoriteDto;
    const exists = await this.favoriteRepository.findOne({ where: { user: { id: userId }, book: { id: bookId } } });
    if (exists) {
        return { message: 'الكتاب موجود بالفعل في المفضلة' };
    }
    return this.favoriteRepository.save({ user: { id: userId }, book: { id: bookId } });
}
  async findAll(): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
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
          total_ratings: true,
          total_pages:true
        },
      }
  });
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
          total_ratings: true,
          total_pages:true
        },
      }
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    return favorite;
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto): Promise<Favorite> {
    const favorite = await this.findOne(id);
    
    if (updateFavoriteDto.bookId) {
      favorite.book = { id: updateFavoriteDto.bookId } as Book;
    }
    if (updateFavoriteDto.userId) {
      favorite.user = { id: updateFavoriteDto.userId } as User;
    }

    return await this.favoriteRepository.save(favorite);
  }

  async remove(id: number): Promise<void> {
    const result = await this.favoriteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }
  }
}