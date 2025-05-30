import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { StaticPage } from './entities/static-page.entity';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { QueryStaticPageDto } from './dto/query-static-page.dto';

@Injectable()
export class StaticPageService {
  constructor(
    @InjectRepository(StaticPage)
    private readonly staticPageRepository: Repository<StaticPage>,
  ) {}

  async create(createStaticPageDto: CreateStaticPageDto): Promise<StaticPage> {
    const page = this.staticPageRepository.create(createStaticPageDto);
    return await this.staticPageRepository.save(page);
  }

 async findAll(query: QueryStaticPageDto): Promise<{ data: Partial<StaticPage>[]; count: number }> {
    const { search, lang, is_published, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const options: FindManyOptions<StaticPage> = {
        skip,
        take: limit,
    };

    if (is_published !== undefined) {
        options.where = { ...options.where, is_published: is_published === 'true' };
    }

    if (search) {
        if (lang === 'ar') {
            options.where = [
                { ...options.where, ar_title: Like(`%${search}%`) },
                { ...options.where, ar_content: Like(`%${search}%`) },
            ];
        } else {
            options.where = [
                { ...options.where, en_title: Like(`%${search}%`) },
                { ...options.where, en_content: Like(`%${search}%`) },
            ];
        }
    }

    const [data, count] = await this.staticPageRepository.findAndCount(options);

    const filteredData = data.map(page => {
        const baseFields = {
            id: page.id,
            url: page.url,
            is_published: page.is_published,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt
        };

        if (lang === 'ar') {
            return {
                ...baseFields,
                ar_title: page.ar_title,
                ar_content: page.ar_content
            };
        } else if (lang === 'en') {
            return {
                ...baseFields,
                en_title: page.en_title,
                en_content: page.en_content
            };
        }

        return page; 
    });

    return { data: filteredData, count };
}

  async findOne(id: number): Promise<StaticPage> {
    const page = await this.staticPageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Static page with ID ${id} not found`);
    }
    return page;
  }

  async update(id: number, updateStaticPageDto: UpdateStaticPageDto): Promise<StaticPage> {
    const page = await this.findOne(id);
    Object.assign(page, updateStaticPageDto);
    return await this.staticPageRepository.save(page);
  }

   async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.staticPageRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No static pages found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} static pages deleted successfully`, 
      warning: 'Some static pages were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} static pages deleted successfully` 
  };
}
}