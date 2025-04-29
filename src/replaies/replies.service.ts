// src/replies/replies.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './entities/replay.entity';
import { CreateReplyDto } from './dto/create-replay.dto';
import { UpdateReplayDto } from './dto/update-replay.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  create(createReplyDto: CreateReplyDto) {
    const reply = this.replyRepository.create(createReplyDto);
    return this.replyRepository.save(reply);
  }

  findAll() {
    return this.replyRepository.find({ relations: ['comment', 'user'] });
  }

  findOne(id: number) {
    return this.replyRepository.findOne({ where: { id }, relations: ['comment', 'user'] });
  }

  update(id: number, updateReplyDto: UpdateReplayDto) {
    return this.replyRepository.update(id, updateReplyDto);
  }

  remove(id: number) {
    return this.replyRepository.delete(id);
  }
}
