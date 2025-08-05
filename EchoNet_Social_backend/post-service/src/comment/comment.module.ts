import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentController } from './comment.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ClientsModuleProxy } from 'src/shared/client-proxy/client-proxy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    CloudinaryModule,
    ClientsModuleProxy
  ],
  providers: [CommentService, CommentRepository],
  exports: [CommentService, CommentRepository],
  controllers: [CommentController],
})
export class CommentModule { }
