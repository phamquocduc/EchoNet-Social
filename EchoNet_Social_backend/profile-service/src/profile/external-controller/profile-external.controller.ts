import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ProfileService } from "../profile.service";
import { ProfileCreateDto } from "../dto/profile-create.dto";
import { ProfileUpdateDto } from "../dto/profile-update.dto";

@Controller()
export class ProfileExternalController {
    constructor(private readonly profileServices: ProfileService) { }

    @MessagePattern({ cmd: 'create_profile' })
    async createProfile(data: { profile: ProfileCreateDto }) {
        console.log('create_profile', data);
        await this.profileServices.createProfile(data.profile);
    }
}