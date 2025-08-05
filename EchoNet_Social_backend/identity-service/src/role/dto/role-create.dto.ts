import { IsEmail, IsString } from 'class-validator';
import { ERole } from 'src/enum/role.enum';

export class RoleCreateDto{

    @IsString()
    roleName: ERole;
}