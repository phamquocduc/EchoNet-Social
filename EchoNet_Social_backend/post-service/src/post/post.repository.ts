import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "./post.entity";
import { Media } from "src/media/media.entity";

@Injectable()
export class PostRepository {
    constructor(@InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>) { }

    async createPost(userId: number, content: string, media: Media[]): Promise<PostEntity> {
        const newPost = this.postRepository.create({
            userId,
            content,
            media,
        });
        return await this.postRepository.save(newPost);
    }

    async findAll(userId: number): Promise<PostEntity[] | null> {
        return await this.postRepository.find({
            where: {
                userId: userId
            },
            relations: {
                media: true,
                comments: true,
                reactions: true
            }
        });
    }
}