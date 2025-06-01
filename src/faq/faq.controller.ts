import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query, Patch } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';

@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  async create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
async findAll(
  @Query('lang') lang: string = 'en',
  @Query('status') status?: 'active' | 'inactive'
) {
  return this.faqService.findAll(lang, status);
}

  @Get(':id')
findOne(@Param('id') id: string, @Query('lang') lang?: string) {
  return this.faqService.findOne(+id, lang);
}


  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

   @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.faqService.remove(body.ids);
}
}