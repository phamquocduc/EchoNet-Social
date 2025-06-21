import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileExternalController } from './external-controller/profile-external.controller';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { ProfileServiceOnInit } from './profile-oninit.service';
import { ProfileController } from './profile.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FriendshipController } from './profile-friendship.controller';

@Module({
    imports: [
        CloudinaryModule,
    ],
    controllers: [
        ProfileExternalController,
        ProfileController,
        FriendshipController
    ],
    providers: [
        ProfileService,
        ProfileServiceOnInit
    ],
    exports: [ProfileService, ProfileServiceOnInit],
})
export class ProfileModule { }
