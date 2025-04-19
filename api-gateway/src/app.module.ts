import { Module, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AuthMiddleware } from './auth/midleware/authentication.midleware';
import { AuthenticationService } from './auth/authentication.services';
import { ConfigModule } from '@nestjs/config';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.local',
    }),
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
  controllers: [],
  providers: [AuthMiddleware, AuthenticationService],
  exports: [AuthenticationService]
})
export class AppModule {
}
