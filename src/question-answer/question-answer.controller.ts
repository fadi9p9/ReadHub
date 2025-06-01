import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { QuestionAnswersService } from './question-answer.service';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { UpdateQuestionAnswerDto } from './dto/update-question-answer.dto';

@Controller('question-answers')
export class QuestionAnswersController {
  constructor(private readonly questionAnswersService: QuestionAnswersService) {}

  @Post()
  create(@Body() createQuestionAnswerDto: CreateQuestionAnswerDto) {
    return this.questionAnswersService.create(createQuestionAnswerDto);
  }

 @Get()
findAllPaginated(
  @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  @Query('search') search?: string
) {
  return this.questionAnswersService.findAllWithPaginationAndSearch(page, limit, search);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionAnswerDto: UpdateQuestionAnswerDto) {
    return this.questionAnswersService.update(+id, updateQuestionAnswerDto);
  }

 @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.questionAnswersService.remove(body.ids);
}
}
