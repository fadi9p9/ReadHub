import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { QuizzesService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PaginationQuizDto } from './dto/pagination-quiz.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationQuizDto) {
    return this.quizzesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('lang') lang?: string) {
    return this.quizzesService.findOne(+id, lang);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(+id);
  }
}