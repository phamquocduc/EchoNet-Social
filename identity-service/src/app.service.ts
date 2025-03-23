import { Injectable } from '@nestjs/common';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'indentity Hello World!';
  }

  createUser(createUserEvent : CreateUserEvent) {
    console.log('User created', createUserEvent);
  }
}
