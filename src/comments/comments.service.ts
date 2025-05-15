import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';  
import { Book } from '../books/entities/book.entity'; 
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity'; 


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
    const {title, text, userId, bookId, parentId } = createCommentDto;
    
    const comment = this.commentRepository.create({
      text,
      user: { id: userId },
      book: { id: bookId },
      title: title,
      ...(parentId && { parent: { id: parentId } })
    });
  
    return await this.commentRepository.save(comment);
  }
  async findAll() {
    return this.commentRepository.find({ 
      relations: ['user', 'book', 'replies', 'likes'],
      select: {
        text: true,
        id: true,
        user: {
          id: true,
          first_name: true,
          last_name: true,
          img: true
          }
        ,
        book: {
          id: true,
          title: true,
        },
        replies: {
          id: true,
          text: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
            img: true
          }

        },
        likes: {
          id: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
            img: true
          }
        }
      }
    });
  }
  async findOne(id: number) {
    return this.commentRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'book', 'replies', 'likes'],
      select: {
        id: true,
        text: true,
        user: {
          id: true,
          first_name: true,
          role: true
        },
        book: {
          id: true
        },
        replies: {
          id: true,
          text: true,
          user: {
            id: true,
            first_name: true,
            role: true
          }
          
        },
        likes: {
          id: true,
          user: {
            id: true,
            first_name: true,
            role: true
          }
        }
        

      }
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
  const comment = await this.commentRepository.findOneBy({ id });
  
  if (!comment) {
    throw new NotFoundException(`Comment with ID ${id} not found`);
  }

  this.commentRepository.merge(comment, updateCommentDto);
  
  return this.commentRepository.save(comment);
}

  async remove(id: number) {
  const comment = await this.commentRepository.findOne({
    where: { id },
    relations: ['replies', 'likes']
  });

  if (!comment) {
    throw new NotFoundException(`Comment with ID ${id} not found`);
  }

  await this.commentRepository.remove(comment);

  return { 
    status: 'success',
    message: 'Comment and its associated replies/likes deleted successfully'
  };
}
}
