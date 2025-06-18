import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PaginationFavoriteDto } from './dto/pagination-favorite.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoriteDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationFavoriteDto) {
    return this.favoriteService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteService.findOne(+id);
  }

  

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.favoriteService.remove(body.ids);
}

  @Get('user/:userId')
async findByUserId(
  @Param('userId') userId: string,
  @Query() paginationDto: PaginationFavoriteDto
) {
  return this.favoriteService.findByUserId(+userId, paginationDto);
}

}
