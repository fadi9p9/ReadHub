import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query } from '@nestjs/common';
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
findAllPaginated(
  @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  @Query('search') search?: string
) {
  return this.quizWinnersService.findAllWithPaginationAndSearch(page, limit, search);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizWinnersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizWinnerDto: UpdateQuizWinnerDto) {
    return this.quizWinnersService.update(+id, updateQuizWinnerDto);
  }

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.quizWinnersService.remove(body.ids);
}
}
