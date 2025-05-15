import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { QuizResultsService } from './quiz-result.service';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';

@Controller('quiz-results')
export class QuizResultsController {
  constructor(private readonly quizResultsService: QuizResultsService) {}

  @Post()
  create(@Body() createQuizResultDto: CreateQuizResultDto) {
    return this.quizResultsService.create(createQuizResultDto);
  }

  @Get()
  findAll() {
    return this.quizResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizResultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizResultDto: UpdateQuizResultDto) {
    return this.quizResultsService.update(+id, updateQuizResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizResultsService.remove(+id);
  }
}
