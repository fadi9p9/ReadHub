// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';  
import { Book } from 'src/books/entities/book.entity'; 
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/user/entities/user.entity'; 
// import { User } from 'src/users/entities/user.entity';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>, 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,  
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { text, userId, bookId, parentId } = createCommentDto;
    
    const comment = this.commentRepository.create({
      text, // أو content إذا استخدمت هذا الاسم في DTO
      user: { id: userId },
      book: { id: bookId },
      ...(parentId && { parent: { id: parentId } })
    });
  
    return await this.commentRepository.save(comment);
  }
  async findAll() {
    return this.commentRepository.find({ 
      relations: ['user', 'book', 'replies', 'likes'] 
    });
  }

  async findOne(id: number) {
    return this.commentRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'book', 'replies', 'likes']
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);  
  }

  async remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
