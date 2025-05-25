import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationCategoryDto } from './dto/pagination-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(paginationDto: PaginationCategoryDto) {
    const { page = 1, limit = 10, search, lang } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      if (lang === 'ar') {
        query.where('category.ar_title LIKE :search', { search: `%${search}%` });
      } else {
        query.where('category.title LIKE :search', { search: `%${search}%` });
      }
    }

    const [categories, total] = await query
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    const processedCategories = categories.map(category => ({
      ...category,
      title: lang === 'ar' ? category.ar_title || category.title : category.title,
    }));

    return {
      data: processedCategories,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, lang?: string) {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (lang === 'ar') {
      return {
        ...category,
        title: category.ar_title || category.title,
      };
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return this.categoryRepository.save({ ...category, ...updateCategoryDto });
  }

  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.categoryRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No categories found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} categories deleted successfully`, 
      warning: 'Some categories were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} categories deleted successfully` 
  };
}

}