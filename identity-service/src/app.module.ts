import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { Role } from './role/role.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST, 
      port: Number(process.env.PG_PORT), 
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [
        User,
        Role
      ],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, JwtService],
})
export class AppModule {}
