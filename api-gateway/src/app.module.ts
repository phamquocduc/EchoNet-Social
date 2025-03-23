import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AuthMiddleware } from './auth/midleware/authentication.midleware';
import { AuthenticationService } from './auth/authentication.services';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IDENTITY_SERVICE',
        transport: Transport.TCP,
        options: {
          port: Number(process.env.IDENTITY_TCP_PORT)
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService,AuthMiddleware, AuthenticationService],
  exports: [AuthenticationService]
})
export class AppModule {
}
