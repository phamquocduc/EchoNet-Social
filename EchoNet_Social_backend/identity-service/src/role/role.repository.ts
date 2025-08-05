import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleCreateDto } from "./dto/role-create.dto";
import { Role } from "./role.entity";
import { ERole } from "src/enum/role.enum";

@Injectable()
export class RoleRepository {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async createRole(roleCreate: RoleCreateDto): Promise<Role> {
        const newRole = this.roleRepository.create(roleCreate)

        return await this.roleRepository.save(newRole)
    }

    async findAllRoles(): Promise<Role[] | null> {
        return await this.roleRepository.find()
    }

    async findRoleByRoleName(roleName: ERole): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: {
                roleName: roleName
            }
        })

        if (!role) {
            throw new BadRequestException(`Role ${roleName} not found`)
        }

        return role
    }

    async findRoleNameExited(roleName: ERole): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: {
                roleName: roleName
            }
        })
    }
}