import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
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
@Get('all-formatted')
  async getAllFormatted() {
    return this.quizzesService.getAllFormatted();
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Query('lang') lang?: string) {
    return this.quizzesService.findOne(+id, lang);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(+id, updateQuizDto);
  }

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.quizzesService.remove(body.ids);
}

@Get('user/:userId/all')
async getUserQuizzesWithResults(
  @Param('userId', ParseIntPipe) userId: number,
  @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  @Query('search') search?: string
) {
  return this.quizzesService.getUserQuizzesWithResults(userId, page, limit, search);
}
}