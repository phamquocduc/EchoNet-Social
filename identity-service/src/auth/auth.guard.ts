import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERole } from 'src/enum/role.enum';
import { ROLE_KEY } from './decorators/role.decorator';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './decorators/isPublic.decorator';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const role = this.reflector.getAllAndOverride<ERole>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        const token = this.extractToken(authHeader);

        if (!token) {
            throw new UnauthorizedException();
        }

        const payload = await this.authService.getPayload(token);
        request['user'] = payload;

        const userId = payload.sub;
        console.log('User ID:', userId);

        const check_user_exited = await this.userService.checkUserExited(userId);
        console.log('check user:', check_user_exited);

        if (!check_user_exited) {
            throw new UnauthorizedException('User does not exist');
        }

        const roleToken = payload?.role;

        if (role && role !== roleToken) {
            throw new ForbiddenException();
        }

        return true;
    }

    public extractToken(authHeader?: string): string | undefined {
        if (!authHeader) return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
