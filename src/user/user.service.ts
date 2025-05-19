import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class UsersService {
  private readonly allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.tiff',
    '.bmp',
  ];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private validateImageExtension(filename: string): void {
    const ext = path.extname(filename).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(`File type ${ext} is not allowed. Allowed types: ${this.allowedExtensions.join(', ')}`);
    }
  }

  async create(
    createUserDto: CreateUserDto,
    img?: Express.Multer.File,
  ): Promise<User> {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads', 'users');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (img) {
        this.validateImageExtension(img.originalname);
      }

      const user = this.userRepository.create(createUserDto);

      if (img) {
        user.img = `/uploads/users/${img.filename}`;
      }

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException({
        message: 'Failed to create user',
        details: error.message,
      });
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

   async update(
    id: number,
    updateUserDto: UpdateUserDto,
    img?: Express.Multer.File,
  ): Promise<User> {
    try {
      if (img) {
        this.validateImageExtension(img.originalname);
      }

      const user = await this.findOne(id);

      if (img) {
        if (user.img) {
          const oldImagePath = path.join(
            process.cwd(),
            'uploads',
            'users',
            path.basename(user.img),
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        user.img = `/uploads/users/${img.filename}`;
      }

      Object.assign(user, updateUserDto);
      return this.userRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    if (user.img) {
      const imagePath = path.join(
        process.cwd(),
        'uploads',
        'users',
        path.basename(user.img),
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.userRepository.remove(user);
  }


  async findInactiveSince(date: Date): Promise<User[]> {
    return this.userRepository.find({
      where: { last_login_at: LessThan(date) },
    });
  }
}