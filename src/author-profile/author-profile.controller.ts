import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { AuthorProfileService } from './author-profile.service';
import { CreateAuthorProfileDto } from './dto/create-author-profile.dto';
import { UpdateAuthorProfileDto } from './dto/update-author-profile.dto';

@Controller('author-profiles')
export class AuthorProfileController {
  constructor(private readonly authorProfileService: AuthorProfileService) {}

  @Post()
  create(@Body() dto: CreateAuthorProfileDto) {
    return this.authorProfileService.create(dto);
  }

  @Get()
findAll(
  @Query('lang') lang?: 'ar' | 'en',
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('search') search?: string,
) {
  return this.authorProfileService.findAll(lang, +page, +limit, search);
}


  @Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
  @Query('lang') lang?: 'ar' | 'en',
) {
  return this.authorProfileService.findOne(id, lang);
}


  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorProfileDto) {
    return this.authorProfileService.update(+id, dto);
  }

   @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.authorProfileService.remove(body.ids);
}
}
