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


    private buildPaginationLinks(baseUrl: string, page: number, limit , totalPages: number) {
    const links = {
      first: `${baseUrl}?page=1&limit=${limit}`,
      last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
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
    const { page = 1, limit = 10, search, bookId, userId, email } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.book', 'book')
      .leftJoinAndSelect('comment.likes', 'likes')
      .select([
        'comment.id',
        'comment.text',
        'comment.created_at',
        'comment.updated_at',
        'comment.repliesCount',
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'book.id',
        'book.title',
        'book.ar_title'
      ])
      .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
      .take(limit)
      .skip(skip);

    if (search) {
      query.where(
        '(comment.text LIKE :search OR user.first_name LIKE :search OR user.last_name LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    if (bookId) {
      query.andWhere('comment.bookId = :bookId', { bookId });
    }

    if (userId) {
      query.andWhere('comment.userId = :userId', { userId });
    }

    const [comments, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      text: comment.text,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      likesCount: comment.likesCount,
      repliesCount: comment.repliesCount,
      user: {
        id: comment.user.id,
        first_name: comment.user.first_name,
        last_name: comment.user.last_name,
        email: comment.user.email
      },
      book: {
        title: comment.book.title,
        ar_title: comment.book.ar_title
      }
    }));

    return {
      data: formattedComments,
      meta: {
        total,
        page,
        limit,
        total_pages: totalPages,
      },
      links: this.buildPaginationLinks(baseUrl, page,limit, totalPages),
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
          last_name:true,
          role: true
        },
        book: {
          id: true,
          title:true,
          ar_title:true,
        },
        replies: {
          id: true,
          text: true,
          user: {
            id: true,
            first_name: true,
            last_name:true,
            role: true
          }
          
        },
        likes: {
          id: true,
          user: {
            id: true,
            first_name: true,
            last_name:true,
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

async updateRepliesCount(commentId: number): Promise<void> {
  await this.commentRepository
    .createQueryBuilder()
    .update(Comment)
    .set({
      repliesCount: () => '(SELECT COUNT(*) FROM reply WHERE reply.commentId = :commentId)'
    })
    .where('id = :commentId', { commentId })
    .execute();
}
async findByUserId(userId: number, paginationDto: PaginationCommentDto, baseUrl: string) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.book', 'book')
      .where('user.id = :userId', { userId })
      .select([
        'comment.id',
        'comment.text',
        'comment.title',
        'comment.created_at',
        'comment.updated_at',
        'comment.repliesCount',
        'book.id',
        'book.title',
        'book.ar_title'
      ])
      .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
      .take(limit)
      .skip(skip);

    const [comments, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      text: comment.text,
      title: comment.title,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      likesCount: comment.likesCount,
      repliesCount: comment.repliesCount,
      book: {
        title: comment.book.title,
        ar_title: comment.book.ar_title
      }
    }));

    return {
      data: formattedComments,
      meta: {
        total,
        page,
        limit,
        total_pages: totalPages,
      },
      links: this.buildPaginationLinks(baseUrl, page, limit, totalPages),
    };
}
}
