import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.entity';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/tranform.intercepter';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { VerifyEmailModule } from './verify-email/verify-email.module';
import { VerifyEmail } from './verify-email/verify-email.entity';
import { ForgotPasswordVerifyModule } from './forgot-password-verify/forgot-password-verify.module';
import { ForgotPasswordVerify } from './forgot-password-verify/forgot-password-verify.entity';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath:
          process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.local',
      }
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [
        User,
        Role,
        RefreshToken,
        VerifyEmail,
        ForgotPasswordVerify
      ],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    RefreshTokenModule,
    VerifyEmailModule,
    ForgotPasswordVerifyModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ],
})
export class AppModule { }
