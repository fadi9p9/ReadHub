// src/quiz-winners/quiz-winners.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { QuizWinnersService } from './quiz-winner.service';
import { CreateQuizWinnerDto } from './dto/create-quiz-winner.dto';
import { UpdateQuizWinnerDto } from './dto/update-quiz-winner.dto';

@Controller('quiz-winners')
export class QuizWinnersController {
  constructor(private readonly quizWinnersService: QuizWinnersService) {}

  @Post()
  create(@Body() createQuizWinnerDto: CreateQuizWinnerDto) {
    return this.quizWinnersService.create(createQuizWinnerDto);
  }

  @Get()
  findAll() {
    return this.quizWinnersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizWinnersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizWinnerDto: UpdateQuizWinnerDto) {
    return this.quizWinnersService.update(+id, updateQuizWinnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizWinnersService.remove(+id);
  }
}
