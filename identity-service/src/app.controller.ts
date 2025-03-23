import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user.event';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('user_created')
  createUser(createUserEvent: CreateUserEvent){
    this.appService.createUser(createUserEvent);
  }
}
