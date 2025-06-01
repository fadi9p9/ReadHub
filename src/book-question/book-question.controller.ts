import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { BookQuestionsService } from './book-question.service';
import { CreateBookQuestionDto } from './dto/create-book-question.dto';
import { UpdateBookQuestionDto } from './dto/update-book-question.dto';

@Controller('book-questions')
export class BookQuestionsController {
  constructor(private readonly questionsService: BookQuestionsService) {}

  @Post()
  create(@Body() createDto: CreateBookQuestionDto) {
    return this.questionsService.create(createDto);
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('lang') lang?: string,
    @Query('search') search?: string
  ) {
    return this.questionsService.findAllWithPagination(page, limit, lang,search);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBookQuestionDto
  ) {
    return this.questionsService.update(id, updateDto);
  }

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.questionsService.remove(body.ids);
}
}