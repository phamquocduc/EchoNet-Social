import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostController } from './post.controller';
import { MediaModule } from 'src/media/media.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    MediaModule,
    CloudinaryModule
  ],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule { }
