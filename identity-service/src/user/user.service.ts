import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserAuthCreateDto } from './dto/user-auth.dto';
import { User } from './user.entity';
import { RoleRepository } from 'src/role/role.repository';
import { ERole } from 'src/enum/role.enum';
import { ClientProxy } from '@nestjs/microservices';
import { UserCreateDto } from './dto/user-create.dto';
import { ProfileCreateDto } from './dto/profile-create.dto';
import { firstValueFrom } from 'rxjs';
import { ProfileUpdateDto } from './dto/profile-update.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('PROFILE_SERVICE') private readonly profileService: ClientProxy,
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository
    ) { }

    async createUser(userCreate: UserCreateDto): Promise<User> {

        const { password, confirmPassword } = userCreate

        if (password !== confirmPassword) {
            throw new Error('Password and confirm password do not match')
        }

        const user: UserAuthCreateDto = {
            email: userCreate.email,
            password: userCreate.password,
        }

        const newUser = await this.userRepository.createUser(user)

        const profile: ProfileCreateDto = {
            userid: newUser.id,
            fullname: userCreate.fullname,
        }

        this.profileService.emit({ cmd: 'create_profile' }, { profile })
        return newUser
    }

    async userGetByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneByEmail(email)
    }

    async updateUserisVerified(userId: number) {
        await this.userRepository.updateUserisVerified(userId)
    }

    async userGetProfile(userId: number) {
        const profile = await firstValueFrom(
            this.profileService.send({ cmd: 'get_profile' }, { userId })
        )

        return profile
    }

    async userUpdateProfile(userId: number, profile: ProfileUpdateDto) {
        return await firstValueFrom(this.profileService.send({ cmd: 'update_profile' }, { userId, profile }))
    }
}
