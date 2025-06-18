import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileExternalController } from './external-controller/profile-external.controller';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { ProfileServiceOnInit } from './profile-oninit.service';
import { ProfileController } from './profile.controller';

@Module({
    imports: [
    ],
    controllers: [
        ProfileExternalController,
        ProfileController
    ],
    providers: [
        ProfileService,
        ProfileServiceOnInit
    ],
    exports: [ProfileService, ProfileServiceOnInit],
})
export class ProfileModule { }
