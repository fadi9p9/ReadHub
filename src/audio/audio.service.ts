import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Audio } from './entities/audio.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { promises as fsPromises } from 'fs';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(Audio)
    private readonly audioRepo: Repository<Audio>,

    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async saveAudio(filename: string, title: string, bookId: number): Promise<Audio> {
    const book = await this.bookRepo.findOne({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException('Book Not Found');
    }

    const audio = this.audioRepo.create({
      title,
      filePath: filename,
      book,
    });

    return this.audioRepo.save(audio);
  }

  streamAudio(filename: string, res: Response) {
    const filePath = path.join(__dirname, '../../../uploads/audio', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File Not Found');
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }

  async deleteAudio(audioId: number): Promise<{ message: string }> {
  const audio = await this.audioRepo.findOne({
    where: { id: audioId },
    relations: ['book'],
  });

  if (!audio) {
    throw new NotFoundException('Audio Not Found');
  }

  const filePath = path.join(__dirname, '../../../uploads/audio', audio.filePath);
  try {
    await fsPromises.unlink(filePath);
  } catch (err) {
    console.warn('Failed to delete audio file:', err.message);
  }

  await this.audioRepo.remove(audio);

  return { message: `Audio "${audio.title}" has been deleted successfully.` };
  }

  async findByBookId(bookId: number) {
    return this.audioRepo.findOne({
      where: { bookId },
    });
  }

}
