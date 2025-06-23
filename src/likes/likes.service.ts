import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Book } from 'src/books/entities/book.entity';
@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
     private readonly likeRepository: Repository<Like>,
      @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}
 async toggleLike(userId: number, commentId: number): Promise<{ comment: Comment; action: 'liked' | 'unliked' }> {
    return this.likeRepository.manager.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { id: commentId },
        lock: { mode: 'pessimistic_write' }
      });
      
      const user = await manager.findOne(User, { where: { id: userId } });

      if (!comment) throw new NotFoundException('التعليق غير موجود');
      if (!user) throw new NotFoundException('المستخدم غير موجود');

      const existingLike = await manager.findOne(Like, {
        where: { userId, commentId }
      });

      if (existingLike) {
        await manager.delete(Like, existingLike.id);
        comment.likesCount = Math.max(0, comment.likesCount - 1);
        await manager.save(comment);
        return { comment, action: 'unliked' };
      } else {
        const newLike = manager.create(Like, { userId, commentId });
        await manager.save(newLike);
        comment.likesCount += 1;
        await manager.save(comment);
        return { comment, action: 'liked' };
      }
    });
  }

  findAll() {
    return this.likeRepository.find({ relations: ['comment', 'user'] ,
      select: {
        id: true,
        created_at: true,
        user: {
          id: true,
          first_name: true,
          last_name: true,

        },
        comment: {
          id: true,
          text: true,
          created_at: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      }
     });
  }

  findOne(id: number) {
    return this.likeRepository.findOne({ where: { id }, relations: ['comment', 'user'] ,
      select: {
        id: true,
        created_at: true,
        user: {
          id: true,
          first_name: true,
          last_name: true,
        },
        comment: {
          id: true,
          text: true,
          created_at: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      }
    });
  }

  async update(id: number, updateLikeDto: UpdateLikeDto) {
    const like = await this.likeRepository.findOne({ 
      where: { id },
      relations: ['user', 'comment'],
      select: {
        id: true,
        created_at: true,
        user: {
          id: true,
          first_name: true,
          last_name: true,
        },
        comment: {
          id: true,
          text: true,
          created_at: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      }
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    if (updateLikeDto.userId) {
      const user = await this.usersRepository.findOneBy({ 
        id: updateLikeDto.userId 
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      like.user = user;
    }

    if (updateLikeDto.commentId) {
      const comment = await this.commentsRepository.findOneBy({ 
        id: updateLikeDto.commentId 
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      like.comment = comment;
    }

    return this.likeRepository.save(like);
  }
  remove(id: number) {
    return this.likeRepository.delete(id);
  }
}
