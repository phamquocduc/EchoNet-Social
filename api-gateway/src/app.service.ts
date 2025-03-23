import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequestDto } from './create-user-request.dto';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
  constructor(
    @Inject('IDENTITY_SERVICE') private readonly communicationClient: ClientProxy,
  ){}
  private readonly users: any[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequestDto) {
    this.users.push(createUserRequest);
    this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email, createUserRequest.password),
    );
  }
}
