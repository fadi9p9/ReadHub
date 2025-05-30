import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { StaticPageService } from './static-page.service';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { QueryStaticPageDto } from './dto/query-static-page.dto';

@Controller('static-pages')
export class StaticPageController {
  constructor(private readonly staticPageService: StaticPageService) {}

  @Post()
  create(@Body() createStaticPageDto: CreateStaticPageDto) {
    return this.staticPageService.create(createStaticPageDto);
  }

  @Get()
  findAll(@Query() query: QueryStaticPageDto) {
    return this.staticPageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staticPageService.findOne(+id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaticPageDto: UpdateStaticPageDto) {
    return this.staticPageService.update(+id, updateStaticPageDto);
  }

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.staticPageService.remove(body.ids);
}
}