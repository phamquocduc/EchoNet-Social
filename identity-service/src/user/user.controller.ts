import { Body, Controller, Get, Post, Put, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserCreateDto } from "./dto/user-create.dto";
import { Public } from "src/auth/decorators/isPublic.decorator";
import { profile } from "console";
import { ProfileUpdateDto } from "./dto/profile-update.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    @Public()
    async create(@Body() userCreation: UserCreateDto): Promise<User> {
        return await this.userService.createUser(userCreation)
    }

    @Get('profile')
    async userGetProfile(@Req() request: Request) {
        const userId = request['user'].sub
        return await this.userService.userGetProfile(userId)
    }

    @Put('update-profile')
    async userUpdateProfile(@Req() request: Request, @Body() profile: ProfileUpdateDto) {
        const userId = request['user'].sub
        return await this.userService.userUpdateProfile(userId, profile)
    }
}
