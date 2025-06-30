import { Controller, Get, Post, Body, Param, Patch, Delete, Query, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationCommentDto } from './dto/pagination-comment.dto';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationCommentDto,
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}${request.path}`;
    return this.commentsService.findAll(paginationDto, baseUrl);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.commentsService.remove(body.ids);
}

@Get('user/:userId/all')
async findCommentsAndRepliesByUserId(
  @Param('userId') userId: string,
  @Query() paginationDto: PaginationCommentDto,
  @Req() request: Request,
) {
  const baseUrl = `${request.protocol}://${request.get('host')}${request.path}`;
  return this.commentsService.findCommentsAndRepliesByUserId(+userId, paginationDto, baseUrl);
}

}
