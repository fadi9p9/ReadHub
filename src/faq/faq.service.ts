import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ResponseFaqDto } from './dto/response-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    const faq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(faq);
  }

  async findAll(lang: string, status?: 'active' | 'inactive') {
  let query = this.faqRepository.createQueryBuilder('faq');

  if (status) {
    query = query.where('faq.isPublished = :status', { 
      status: status === 'active' ? 'active' : 'inactive' 
    });
  }

  const faqs = await query.getMany();

  return faqs.map(faq => ({
    id: faq.id,
    question: lang === 'ar' ? faq.arQuestion : faq.enQuestion,
    answer: lang === 'ar' ? faq.arAnswer : faq.enAnswer,
    status: faq.isPublished
  }));
}

async findOne(id: number, lang: string = 'en') {
  const faq = await this.faqRepository.findOneBy({ id });

  if (!faq) throw new Error('FAQ not found');

  return {
    id: faq.id,
    question: lang === 'ar' ? faq.arQuestion : faq.enQuestion,
    answer: lang === 'ar' ? faq.arAnswer : faq.enAnswer,
    status: faq.isPublished,
  };
}
  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    const faq = await this.faqRepository.findOneBy({ id });
    if (!faq) throw new Error('FAQ not found');

    Object.assign(faq, updateFaqDto);

    return this.faqRepository.save(faq);
  }

  async remove(ids: number[] | number) {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    
    const deleteResult = await this.faqRepository.delete(idsArray);
    
    const affectedRows = deleteResult.affected || 0;
    
    if (affectedRows === 0) {
      throw new NotFoundException(`No faqs found with the provided IDs`);
    }
    
    if (affectedRows < idsArray.length) {
      return { 
        message: `Only ${affectedRows} faqs deleted successfully`, 
        warning: 'Some faqs were not found' 
      };
    }
    
    return { 
      message: `${affectedRows} faqs deleted successfully` 
    };
  }
}