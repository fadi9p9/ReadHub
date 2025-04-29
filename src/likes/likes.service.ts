// src/likes/likes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
@Injectable()
export class LikesService {
  usersRepository: any;
  commentsRepository: any;
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
    // التحقق من وجود الكيانات المرتبطة أولاً
    const user = await this.usersRepository.findOneBy({ id: createLikeDto.userId });
    if (!user) throw new NotFoundException('User not found');
  
    const comment = await this.commentsRepository.findOneBy({ id: createLikeDto.commentId });
    if (!comment) throw new NotFoundException('Comment not found');
  
    // إنشاء الـ Like
    const like = this.likeRepository.create({
      user: { id: createLikeDto.userId },
      comment: { id: createLikeDto.commentId }
    });
  
    return this.likeRepository.save(like);
  }

  findAll() {
    return this.likeRepository.find({ relations: ['comment', 'user'] });
  }

  findOne(id: number) {
    return this.likeRepository.findOne({ where: { id }, relations: ['comment', 'user'] });
  }

  async update(id: number, updateLikeDto: UpdateLikeDto) {
    if (updateLikeDto.userId) {
      const user = await this.usersRepository.findOneBy({ id: updateLikeDto.userId });
      if (!user) throw new NotFoundException('User not found');
    }
  
    if (updateLikeDto.commentId) {
      const comment = await this.commentsRepository.findOneBy({ id: updateLikeDto.commentId });
      if (!comment) throw new NotFoundException('Comment not found');
    }
  
    await this.likeRepository.update(id, {
      ...(updateLikeDto.userId && { user: { id: updateLikeDto.userId } }),
      ...(updateLikeDto.commentId && { comment: { id: updateLikeDto.commentId } })
    });
  
    return this.findOne(id);
  }

  remove(id: number) {
    return this.likeRepository.delete(id);
  }
}
