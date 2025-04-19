import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtServices: JwtService,
    ) { }

    async getPayload(token: string): Promise<any | undefined> {
        try {
            const decoded = await this.jwtServices.verifyAsync(token, { ignoreExpiration: true });

            return decoded;
        } catch (error) {
            throw error;
        }
    }
}