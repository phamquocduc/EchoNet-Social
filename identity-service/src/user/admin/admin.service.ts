import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { RoleRepository } from 'src/role/role.repository';
import { ERole } from 'src/enum/role.enum';
import { RoleCreateDto } from 'src/role/dto/role-create.dto';
import { UserCreateDto } from '../dto/user-create.dto';

@Injectable()
export class UserAdminServices implements OnModuleInit {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository
    ) {}

    async onModuleInit() {

        let role = await this.roleRepository.findAdminRole(ERole.ADMIN)

        const adminUser = await this.userRepository.findUserByRoleName(ERole.ADMIN)

        const adminRole : RoleCreateDto = {
            roleName: ERole.ADMIN
        }

        const admin : UserCreateDto = {
            email: "admin123@gmail.com",
            password: "admin123",
        }

        if(!role){
            role = await this.roleRepository.createRole(adminRole)
        }

        if(!adminUser){
            const adminUser = await this.userRepository.createUser(admin, role.id)
            console.log("Admin :", adminUser)
        }else{
            console.log("Admin :", adminUser)
        }
    }
}
