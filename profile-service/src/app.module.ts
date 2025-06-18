import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Neo4jModule } from 'nest-neo4j';
import { ProfileModule } from './profile/profile.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TransformInterceptor } from './interceptors/tranform.intercepter';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

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
    Neo4jModule.forRootAsync({
      useFactory: () => ({
        scheme: process.env.NEO4J_SCHEME,
        host: process.env.NEO4J_HOST,
        port: Number(process.env.NEO4J_PORT),
        username: process.env.NEO4J_USERNAME,
        password: process.env.NEO4J_PASSWORD,
        database: process.env.NEO4J_DATABASE,
      }),
    }),
    AuthModule,
    ProfileModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ],
})
export class AppModule { }
