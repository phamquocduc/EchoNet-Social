import { Body, Controller, Get, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleCreateDto } from "./dto/role-create.dto";
import { Role } from "./role.entity";
import { ERole } from "src/enum/role.enum";
import { HasRole } from "src/auth/decorators/role.decorator";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get()
    @HasRole(ERole.ADMIN)
    async getRoles(): Promise<Role[] | null> {
        return await this.roleService.getAllRoles()
    }

    @Post('create')
    @HasRole(ERole.ADMIN)
    async createRole(@Body() roleCreate: RoleCreateDto): Promise<Role> {
        return await this.roleService.createRole(roleCreate)
    }
}