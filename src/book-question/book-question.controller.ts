import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { BookQuestionsService } from './book-question.service';
import { CreateBookQuestionDto } from './dto/create-book-question.dto';
import { UpdateBookQuestionDto } from './dto/update-book-question.dto';

@Controller('book-questions')
export class BookQuestionsController {
  constructor(private readonly bookQuestionsService: BookQuestionsService) {}

  @Post()
  create(@Body() createBookQuestionDto: CreateBookQuestionDto) {
    return this.bookQuestionsService.create(createBookQuestionDto);
  }

  @Get()
  findAll() {
    return this.bookQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookQuestionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookQuestionDto: UpdateBookQuestionDto) {
    return this.bookQuestionsService.update(+id, updateBookQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookQuestionsService.remove(+id);
  }
}
