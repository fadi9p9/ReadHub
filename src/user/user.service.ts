import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private usersRepo: Repository<User>,
  ){}

  create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepo.create(createUserDto);
    return this.usersRepo.save(newUser);
  }

  findAll() {
    const allUsers = this.usersRepo.find();
    return allUsers; 
  }

  findOne(id: number) {
    const user = this.usersRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException ;
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOneBy({ email: email });
  }
  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.usersRepo.delete(id);
  }
}
