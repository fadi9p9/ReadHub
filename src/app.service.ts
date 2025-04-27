import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloPost(): string{
    return 'post request';
  }

  sayHi(name: string) :string {
    return 'Hi ' + name ;
  }
}
