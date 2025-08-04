import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';

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
            fullName: userCreate.fullname
        }

        const newUser = await this.userRepository.createUser(user)

        return newUser
    }

    async defaulProfile(userId: number, fullname: string): Promise<void> {
        const profile: ProfileCreateDto = {
            userid: userId,
            fullname: fullname,
        }

        this.profileService.emit({ cmd: 'create_profile' }, { profile })
    }

    async userGetByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneByEmail(email)

        if (!user) {
            throw new BadRequestException('User not found')
        }

        return user
    }

    async updateUserisVerified(email: string) {
        await this.userRepository.updateUserisVerified(email)
    }

    async userResetPassword(email: string, newPassword: string): Promise<void> {
        const hashPassword = await bcrypt.hash(newPassword, 10)
        await this.userRepository.userResetPassword(email, hashPassword)
    }

    async checkUserExited(userId: number): Promise<boolean> {
        return await this.userRepository.checkUserExitedById(userId);
    }
}
