import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentRepository {
    constructor(@InjectRepository(Comment) private readonly: Repository<Comment>) { }
}