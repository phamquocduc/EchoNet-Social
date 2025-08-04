import { Body, Controller, Get, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/creat-post.dto';
import { PostService } from './post.service';
import { MediaUploadInterceptor } from 'src/interceptors/media-upload.intercepter';
import { PostEntity } from './post.entity';
import { Public } from 'src/auth/decorators/isPublic.decorator';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    async getAllPostsOfUser(@Req() request: Request): Promise<PostEntity[] | null> {
        const userId = request['user'].sub;

        return this.postService.findAll(userId);
    }

    @Post()
    @UseInterceptors(MediaUploadInterceptor)
    async createPost(@Req() request: Request, @Body() dto: CreatePostDto, @UploadedFiles() files: Express.Multer.File[]) {
        const userId = request['user'].sub;
        return await this.postService.create(userId, dto, files);
    }

}
