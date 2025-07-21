import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Get,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AudioService } from './audio.service';
import { Response } from 'express';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('upload/:bookId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/audio',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Param('bookId') bookId: number,
    @Body('title') title: string,
  ) {
    const audio = await this.audioService.saveAudio(file.filename, title, bookId);
    return { message: 'Uploaded Successfully', audio };
  }

  @Delete(':id')
  deleteAudio(@Param('id') id: number) {
    return this.audioService.deleteAudio(id);
  }

  @Get('book/:bookId')
  findByBookId(@Param('bookId') bookId: number) {
    return this.audioService.findByBookId(bookId);
  }

  @Get('play/:filename')
  play(@Param('filename') filename: string, @Res() res: Response) {
    return this.audioService.streamAudio(filename, res);
  }
  
}
