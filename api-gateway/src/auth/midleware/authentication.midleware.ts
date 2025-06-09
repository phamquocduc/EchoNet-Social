import { Inject, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/auth/authentication.services';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  private publicRoutes = [
    '/auth/login',
    '/auth/google',
    '/auth/refresh-token',
    '/auth/google/redirect',
    '/auth/register',
  ];

  constructor(
    @Inject('IDENTITY_SERVICE') private readonly identityClient: ClientProxy,
    private readonly authService: AuthenticationService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    if (this.publicRoutes.includes(req.path)) {
      return next();
    }

    const token = this.authService.extractToken(req.headers['authorization']);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const result = await firstValueFrom(this.identityClient.send({ cmd: 'validate_token' }, { token }))

      if (!result || !result.valid && result.code === 401) {
        console.log('Unauthorized');
        throw new UnauthorizedException();
      }

      next()
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
