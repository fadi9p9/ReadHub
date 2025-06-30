import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  ParseFloatPipe,
  BadRequestException,
  Put,
  HttpStatus,HttpCode,
  DefaultValuePipe
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UsersService } from 'src/user/user.service';
import { GetSubscribedBooksDto } from 'src/user/dto/create-user.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService,private readonly userService: UsersService 
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}`;
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    return this.booksService.create(
      createBookDto,
      files?.image?.[0],
      files?.file?.[0],
    );
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.booksService.findAll(paginationDto);
  }

  @Get('all-formatted')
  async getAllFormatted() {
    return this.booksService.getAllFormatted();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: string,
  ) {
    return this.booksService.findOne(id, lang);
  }


   @Get('/comment/:id')
  async findComment(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: string,
  ) {
    return this.booksService.findComment(id, lang);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}`;
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    return this.booksService.update(
      id,
      updateBookDto,
      files?.image?.[0],
      files?.file?.[0],
    );
  }

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.booksService.remove(body.ids);
}


  @Post(':id/add-rating')
async addRating(
  @Param('id', ParseIntPipe) bookId: number,
  @Query('rating', ParseFloatPipe) rating: number,
) {
  if (rating < 0 || rating > 5) {
    throw new BadRequestException('Rating must be between 0 and 5');
  }
  return this.booksService.addRating(bookId, rating);
}





  @Post(':id/categories')
  addCategories(
    @Param('id') id: number,
    @Body() { categoryIds }: { categoryIds: number[] }
  ) {
    return this.booksService.addCategories(id, categoryIds);
  }

  @Patch(':id/categories')
  updateCategories(
    @Param('id') id: number,
    @Body() { categoryIds }: { categoryIds: number[] }
  ) {
    return this.booksService.updateCategories(id, categoryIds);
  }

  @Delete(':id/categories')
  removeCategories(
    @Param('id') id: number,
    @Body() { categoryIds }: { categoryIds: number[] }
  ) {
    return this.booksService.removeCategories(id, categoryIds);
  }
  @Post('subscribed')
  async getSubscribedBooks(@Body() body: { userId: number }) {
    const { userId } = body;

    if (typeof userId !== 'number' || isNaN(userId)) {
      return { error: 'userId must be a valid number' };
    }

    return this.booksService.getSubscribedBooks(userId);
  }
  @Get('by-author/:authorId')
async getBooksByAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
  return this.booksService.findBooksByAuthorId(authorId);
}


@Get(':id/recommendations')
async getRecommendations(
  @Param('id', ParseIntPipe) id: number,
  @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number
) {
  return this.booksService.getRecommendedBooks(id, limit);
}

}