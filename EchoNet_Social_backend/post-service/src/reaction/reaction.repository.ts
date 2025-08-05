import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reaction } from "./reaction.entity";

@Injectable()
export class ReactionRepository {
    constructor(@InjectRepository(Reaction) private readonly: Repository<Reaction>) { }
}