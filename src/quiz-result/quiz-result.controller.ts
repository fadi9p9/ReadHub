import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
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
findAllPaginated(
  @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  @Query('search') search?: string
) {
  return this.quizResultsService.findAllWithPaginationAndSearch(page, limit, search);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizResultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizResultDto: UpdateQuizResultDto) {
    return this.quizResultsService.update(+id, updateQuizResultDto);
  }

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.quizResultsService.remove(body.ids);
}
}
