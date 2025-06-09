import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UserAuthCreateDto } from "./dto/user-auth.dto";
import { ERole } from "src/enum/role.enum";
import { Role } from "src/role/role.entity";
import { RoleRepository } from "src/role/role.repository";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly roleRepository: RoleRepository
    ) { }

    async createUser(userCreate: UserAuthCreateDto): Promise<User> {

        const role = await this.roleRepository.findRoleByRoleName(ERole.USER)

        const newUser = this.userRepository.create({
            ...userCreate,
            role: {
                id: role.id
            }
        })

        return await this.userRepository.save(newUser)
    }

    async findUserByRoleName(roleName: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                role: {
                    roleName: roleName
                }
            },
            relations: {
                role: true
            }
        })
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            },
            relations: {
                role: true
            }
        })

        return user
    }

    async updateUserisVerified(email: string) {
        let user = await this.userRepository.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new BadRequestException(`User not exist`)
        }

        Object.assign(user, { isVerified: true })
        return await this.userRepository.save(user)
    }
}