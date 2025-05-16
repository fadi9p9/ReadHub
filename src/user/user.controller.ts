import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Express } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

    @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), 
        ],
        fileIsRequired: false,
      }),
    )
    img?: Express.Multer.File,
  ) {
    return this.userService.create(createUserDto, img);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), 
        ],
        fileIsRequired: false,
      }),
    )
    img?: Express.Multer.File,
  ) {
    return this.userService.update(+id, updateUserDto, img);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}