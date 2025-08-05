import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentCreateDto } from './dto/comment-create.dto';
import { imageUploadInterceptor } from 'src/interceptors/media-upload.intercepter';
import { Comment } from './comment.entity';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @Post()
    @UseInterceptors(imageUploadInterceptor)
    async createComment(@Req() request: Request, @Body() commentDto: CommentCreateDto,
        @UploadedFile('file') image: Express.Multer.File
    ): Promise<Comment> {
        const userId = request['user'].sub;
        return await this.commentService.createComment(userId, commentDto, image);
    }
}
