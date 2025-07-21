import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { Audio } from './entities/audio.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audio, Book])],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
