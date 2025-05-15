import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-replay.dto';
import { UpdateReplayDto } from './dto/update-replay.dto';
@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post()
  create(@Body() createReplyDto: CreateReplyDto) {
    return this.repliesService.create(createReplyDto);
  }

  @Get()
  findAll() {
    return this.repliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.repliesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReplyDto: UpdateReplayDto
  ) {
    return this.repliesService.update(id, updateReplyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.repliesService.remove(id);
  }
}