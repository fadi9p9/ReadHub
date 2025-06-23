import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CreatePendingBookDto } from './dto/create-pending-book.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PendingBooksService } from './pending-book.service';

@Controller('pending-books')
export class PendingBooksController {
  constructor(private readonly pendingBooksService: PendingBooksService) {}

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
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  create(
    @Body() dto: CreatePendingBookDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    return this.pendingBooksService.create(dto, files?.image?.[0], files?.file?.[0]);
  }

@Get()
findAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('search') search?: string,
) {
  return this.pendingBooksService.findAll(+page, +limit, search);
}



  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pendingBooksService.findOne(id);
  }

  @Post(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.pendingBooksService.approve(id);
  }

  @Post(':id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
  ) {
    if (!reason) throw new BadRequestException('سبب الرفض مطلوب');
    return this.pendingBooksService.reject(id, reason);
  }

  @Post(':id/pending')
  keepPending(@Param('id', ParseIntPipe) id: number) {
    return this.pendingBooksService.keepPending(id);
  }
  @Delete('bulk')
deleteMany(@Body('ids') ids: number[]) {
  return this.pendingBooksService.deleteMany(ids);
}

}