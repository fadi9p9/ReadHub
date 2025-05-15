import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseInterceptors, UploadedFiles, Query,
  UploadedFile
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

 @Post()
@UseInterceptors(FileFieldsInterceptor([
  { name: 'img', maxCount: 1 }, // صورة واحدة
  { name: 'pdf', maxCount: 1 } // PDF واحد
], {
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'img') {
        cb(null, './uploads/images');
      } else if (file.fieldname === 'pdf') {
        cb(null, './uploads/pdfs');
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
}))
async create(@Body() createBookDto: CreateBookDto, @UploadedFiles() files: { img?: Express.Multer.File[], pdf?: Express.Multer.File[] }) {
  const img = files.img ? files.img[0] : undefined;
  const pdf = files.pdf ? files.pdf[0] : undefined;
  return this.booksService.create(createBookDto, img, pdf);  
}

 
@Patch(':id')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'img', maxCount: 1 }, // صورة واحدة
  { name: 'pdf', maxCount: 1 } // PDF واحد
], {
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'img') {
        // تخزين الصور في uploads/images
        cb(null, './uploads/images');
      } else if (file.fieldname === 'pdf') {
        // تخزين ملفات PDF في uploads/pdfs
        cb(null, './uploads/pdfs');
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
}))
async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @UploadedFiles() files: { img?: Express.Multer.File[], pdf?: Express.Multer.File[] }) {
  // التحقق من أن الصور وملفات الـ PDF موجودة أم لا
  const img = files.img ? files.img[0] : undefined;
  const pdf = files.pdf ? files.pdf[0] : undefined;
  return this.booksService.update(+id, updateBookDto, img, pdf); 
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }
  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<{ data: Book[], total: number }> {
    return this.booksService.findAll(paginationDto);
  }}
