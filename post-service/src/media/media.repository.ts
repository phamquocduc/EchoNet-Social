import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Media } from "./media.entity";
import { Repository } from "typeorm";
import { MediaCreateDto } from "./dto/media-create.dto";

@Injectable()
export class MediaRepository {
    constructor(
        @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    ) { }
}