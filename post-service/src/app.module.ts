import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/tranform.intercepter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath:
          process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.local',
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ],
})
export class AppModule { }
