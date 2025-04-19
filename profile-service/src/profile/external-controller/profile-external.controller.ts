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

    @MessagePattern({ cmd: 'get_profile' })
    async getProfile(data: { userId: number }): Promise<any> {
        console.log('get_profile', data);
        return await this.profileServices.findProfileByUserId(data.userId);
    }

    @MessagePattern({ cmd: 'update_profile' })
    async updateProfile(data: { userId: number, profile: ProfileUpdateDto }): Promise<any> {
        console.log('update_profile', data);
        return await this.profileServices.updateProfile(data.userId, data.profile);
    }
}