import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './entities/replay.entity';
import { CreateReplyDto } from './dto/create-replay.dto';
import { UpdateReplayDto } from './dto/update-replay.dto';
import { User } from 'src/user/entities/user.entity';
import { PaginationReplyDto } from './dto/pagination-reply.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  create(createReplyDto: CreateReplyDto) {
    
    
    const replyData = {
      ...createReplyDto,
      user: { id: createReplyDto.userId }, 
      Comment: { id: createReplyDto.commentId },  
    };
    
    const reply = this.replyRepository.create(replyData);


    return this.replyRepository.save(reply);
  }

 async findAll(paginationDto: PaginationReplyDto) {
    const { limit = 10, page = 1, userId, commentId } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.replyRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.user', 'user')
      .leftJoinAndSelect('reply.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .leftJoinAndSelect('comment.book', 'book')
      .select([
        'reply.id',
        'reply.text',
        'reply.created_at',
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.img',
        'comment.id',
        'comment.text',
        'comment.created_at',
        'commentUser.id',
        'commentUser.first_name',
        'commentUser.last_name',
        'commentUser.img',
        'book.title'
      ])
      .take(limit)
      .skip(skip);

    if (userId) {
      query.andWhere('user.id = :userId', { userId });
    }

    if (commentId) {
      query.andWhere('comment.id = :commentId', { commentId });
    }

    const [data, count] = await query.getManyAndCount();

    return {
      data,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  findOne(id: number) {
    return this.replyRepository.findOne({ where: { id }, relations: ['comment', 'user'],
    
      select:{
        id:true,
        text:true,
        created_at:true,
        user: {
          id: true,
          first_name: true,
          last_name:true,
          img:true
          
        },
        comment:{
          id:true,
          text:true,
          user:{
             id: true,
          first_name: true,
          last_name:true,
          img:true,
          },
          book:{
            title:true,

          },
          created_at:true,

        }
      } });
  }

  async update(id: number, updateReplyDto: UpdateReplayDto) {
    const updateData: any = {
        text: updateReplyDto.text,  
    };

    if (updateReplyDto.userId) {
        updateData.user = { id: updateReplyDto.userId };
    }
    if (updateReplyDto.commentId) {
        updateData.comment = { id: updateReplyDto.commentId }; 
    }

    await this.replyRepository.update(id, updateData);
    return this.findOne(id);

    /*
    const reply = await this.findOne(id);
    Object.assign(reply, updateData);
    await this.replyRepository.save(reply);
    return reply;
    */
}

  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.replyRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No replies found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} replies deleted successfully`, 
      warning: 'Some replies were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} replies deleted successfully` 
  };
}
}
