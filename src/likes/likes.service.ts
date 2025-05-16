import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
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

  async create(createLikeDto: CreateLikeDto) {
    try {
      const existingLike = await this.likeRepository.findOne({
        where: {
          user: { id: createLikeDto.userId },
          comment: { id: createLikeDto.commentId },
        },
      });

      if (existingLike) {
        throw new ConflictException('تم إضافة الإعجاب مسبقًا');
      }

      const newLike = this.likeRepository.create({
        user: { id: createLikeDto.userId },
        comment: { id: createLikeDto.commentId }
      });
      await this.likeRepository.save(newLike);

      return {
        message: 'تمت إضافة الإعجاب بنجاح',
        like: newLike,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('الإعجاب موجود مسبقًا');
      }
      throw error;
    }
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
