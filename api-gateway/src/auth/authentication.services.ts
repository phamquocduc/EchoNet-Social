import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthenticationService {
    public extractToken(authHeader?: string): string | undefined {
        if (!authHeader) return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}