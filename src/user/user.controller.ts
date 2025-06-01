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
  Query,
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
async getUsers(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('search') search: string = '',
  @Query('subscribed') subscribed: boolean = false,
    @Query('role') role?: 'admin' | 'author' | 'user',
) {
  return this.userService.findAll(page, limit, search, role,subscribed);
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

  @Get('all-formatted')
  async getAllFormatted() {
    return this.userService.getAllFormatted();
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

  @Delete()
async remove(@Body() body: { ids: number[] }) {
  return this.userService.remove(body.ids);
}

@Post('activate-subscription')
  async activateSubscription(
    @Query('userId') userId: number,
    @Query('plan') plan: 'monthly' | 'yearly',
  ) {
    return this.userService.activateSubscription(userId, plan);
  }
}