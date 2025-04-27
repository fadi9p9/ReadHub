import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/hello')
  sayHello(@Body() body): string {
    return 'Hello '+ body.name;
  }

  @Get('/hi/:name')
  sayHi(@Param() params): string {
    return this.appService.sayHi(params.name);
  }

  @Post()
  getHelloPost(): string {
    return this.appService.getHelloPost();
  }
  @Post('/req')
  getHelloP(@Req() request , @Res() response){
    response.send(request.body);
  }
}
