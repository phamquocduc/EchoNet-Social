import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserCreateDto } from './dto/user-create.dto';
import { User } from './user.entity';
import { RoleRepository } from 'src/role/role.repository';
import { ERole } from 'src/enum/role.enum';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository
    ) {}

    async createUser(userCreate: UserCreateDto): Promise<User> {
        const role = await this.roleRepository.findRoleByRoleName(ERole.USER)
        return await this.userRepository.createUser(userCreate, role.id)
    }
}
