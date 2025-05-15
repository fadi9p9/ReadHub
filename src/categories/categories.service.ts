import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
  const category = await this.categoryRepository.findOne({ 
    where: { id },
    withDeleted: false 
  });

  if (!category) {
    throw new NotFoundException('الفئة غير موجودة');
  }
  return category;
}

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.save({id, ...updateCategoryDto});
  }

  async remove(id: number) {
    const result= this.categoryRepository.delete(id);
     if ((await result).affected === 0) {
    throw new NotFoundException(`category with ID ${id} not found`);
  }
  
  return { message: 'category deleted successfully' };
}
  
}
