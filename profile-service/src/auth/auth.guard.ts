import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERole } from 'src/enum/role.enum';
import { ROLE_KEY } from './decorators/role.decorator';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './decorators/isPublic.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject('IDENTITY_SERVICE') private readonly identityClient: ClientProxy,
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

        const _payload = await firstValueFrom(this.identityClient.send({ cmd: 'validate_token' }, { token }))
        const payload = _payload?.payload

        if (!payload || !payload.valid && payload.code === 401) {
            throw new UnauthorizedException();
        }

        request['user'] = payload;

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
