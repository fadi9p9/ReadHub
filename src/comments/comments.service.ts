import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';  
import { Book } from '../books/entities/book.entity'; 
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity'; 
import { PaginationCommentDto } from './dto/pagination-comment.dto';


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


    private buildPaginationLinks(baseUrl: string, page: number, totalPages: number) {
    const links = {
      first: `${baseUrl}?page=1`,
      last: `${baseUrl}?page=${totalPages}`,
    };

    if (page > 1) {
      links['prev'] = `${baseUrl}?page=${page - 1}`;
    }

    if (page < totalPages) {
      links['next'] = `${baseUrl}?page=${page + 1}`;
    }

    return links;
  }

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
  async findAll(paginationDto: PaginationCommentDto, baseUrl: string) {
    const { page = 1, limit = 10, search, bookId, userId } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.book', 'book')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('comment.likes', 'likes')
      .leftJoinAndSelect('replies.user', 'replyUser')
      .leftJoinAndSelect('likes.user', 'likeUser')
      .take(limit)
      .skip(skip);

    if (search) {
      query.where('comment.text LIKE :search OR comment.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (bookId) {
      query.andWhere('comment.bookId = :bookId', { bookId });
    }

    if (userId) {
      query.andWhere('comment.userId = :userId', { userId });
    }

    const [comments, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        total_pages: totalPages,
      },
      links: this.buildPaginationLinks(baseUrl, page, totalPages),
    };
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

  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.commentRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No comments found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} comments deleted successfully`, 
      warning: 'Some comments were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} comments deleted successfully` 
  };
}
}
