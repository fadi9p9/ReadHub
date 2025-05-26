import { Controller, Get, Post, Body, Param, Patch, Delete, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likesService.update(+id, updateLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(+id);
  }

  

@Post(':commentId/like')
  async toggleLike(
    @Param('commentId') commentId: number,
    @Body() body: { userId: number },
  ) {
    return this.likesService.toggleLike(body.userId, commentId);
  }
}
function CurrentUser(): (target: LikesController, propertyKey: "toggleLike", parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}

