import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileExternalController } from './external-controller/profile-external.controller';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';

@Module({
    imports: [
    ],
    controllers: [
        ProfileExternalController
    ],
    providers: [
        ProfileService,
    ],
    exports: [ProfileService],
})
export class ProfileModule { }
