import { Module } from '@nestjs/common';
import { VerifyEmailModule } from './verify-email/verify-email.module';

@Module({
  imports: [
    VerifyEmailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
