import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user.id;
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
/*
using System;

class Program
{
    static void Main()
    {
        int t = int.Parse(Console.ReadLine());  // عدد حالات الاختبار

        for (int test = 0; test < t; test++)
        {
            char[,] target = new char[10, 10];
            int sum = 0;

            // قراءة الحالة
            for (int r = 0; r < 10; r++)
            {
                string line = Console.ReadLine();
                for (int c = 0; c < 10; c++)
                {
                    target[r, c] = line[c];
                }
            }

            // حساب النقاط
            for (int r = 0; r < 10; r++)
            {
                for (int c = 0; c < 10; c++)
                {
                  if (target[r, c] == 'x')
                    {
                        if (r == 0||r == 9|| c == 0|| c == 9)
                            sum += 1;
                        else if (r == 1|| r == 8 ||  c == 1 ||  c == 8)
                            sum += 2;
                        else if (r == 2 ||  r == 7 ||  c == 2 ||  c == 7)
                            sum += 3;
                        else if (r == 3 ||  r == 6 ||  c == 3 ||  c == 6)
                            sum += 4;
                        else if (r == 4 ||  r == 5 ||  c == 4 || c == 5)
                            sum += 5;
                    }
                  }
                }
             }
                }

            
            Console.WriteLine(sum);
        }
*/