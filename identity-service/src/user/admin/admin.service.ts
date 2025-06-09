import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { RoleRepository } from 'src/role/role.repository';
import { ERole } from 'src/enum/role.enum';
import { RoleCreateDto } from 'src/role/dto/role-create.dto';
import { UserAuthCreateDto } from '../dto/user-auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ProfileCreateDto } from '../dto/profile-create.dto';
import { profile } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/role.entity';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UserAdminServices implements OnModuleInit {
    constructor(
        @Inject('PROFILE_SERVICE') private readonly profileService: ClientProxy,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly roleRepository: RoleRepository
    ) { }

    async onModuleInit() {

        let roleAdmin = await this.roleRepository.findRoleNameExited(ERole.ADMIN)
        let roleUser = await this.roleRepository.findRoleNameExited(ERole.USER)

        const adminUser = await this.userRepository.findOne({
            where: {
                role: {
                    roleName: ERole.ADMIN
                }
            }
        })

        if (!roleAdmin) {
            const adminRole: RoleCreateDto = {
                roleName: ERole.ADMIN
            }

            roleAdmin = await this.roleRepository.createRole(adminRole)
        }

        if (!roleUser) {
            const userRole: RoleCreateDto = {
                roleName: ERole.USER
            }
            roleUser = await this.roleRepository.createRole(userRole)
        }

        if (!adminUser) {
            const admin: UserAuthCreateDto = {
                email: "admin123@gmail.com",
                password: "admin123",
                fullName: "Admin",
            }

            const newUser = this.userRepository.create({
                ...admin,
                isVerified: true,
                role: {
                    id: roleAdmin.id
                }
            })

            const adminUser = await this.userRepository.save(newUser)
            console.log("Admin :", adminUser)

            const adminProfile: ProfileCreateDto = {
                userid: adminUser.id,
                fullname: 'Admin',
                gender: 'male',
                dob: new Date('2000-01-01'),
            }

            this.profileService.emit({ cmd: 'create_profile' }, { profile: adminProfile })
        } else {
            console.log("Admin :", adminUser)
        }
    }
}
