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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

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

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: string,
  ) {
    return this.booksService.findOne(id, lang);
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}