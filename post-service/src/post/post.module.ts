import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostController } from './post.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post])
  ],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule { }
