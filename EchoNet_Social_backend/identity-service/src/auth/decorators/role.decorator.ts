import { SetMetadata } from '@nestjs/common';
import { ERole } from 'src/enum/role.enum';

export const ROLE_KEY = 'roles';
export const HasRole = (role: ERole) => SetMetadata(ROLE_KEY, role);
