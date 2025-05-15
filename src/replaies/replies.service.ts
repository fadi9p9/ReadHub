import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './entities/replay.entity';
import { CreateReplyDto } from './dto/create-replay.dto';
import { UpdateReplayDto } from './dto/update-replay.dto';
import { User } from 'src/user/entities/user.entity';

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

  findAll() {
    return this.replyRepository.find({ relations: ['comment', 'user'],
    
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
      }
     });
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

  remove(id: number) {
    return this.replyRepository.delete(id);
  }
}
