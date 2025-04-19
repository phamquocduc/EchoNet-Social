import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RefreshTokenCreateDto } from './dto/refresh-token-create.dto';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {

    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) { }

    generateRefreshTokenUUID(): string {
        return randomUUID()
    }

    async createRefreshToken(userId: number, deviceInfo: any): Promise<RefreshToken> {

        const refreshTokenUUID = this.generateRefreshTokenUUID()

        const refreshTokenCreateDto: RefreshTokenCreateDto = {
            token: refreshTokenUUID,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now()),
            os: deviceInfo.os,
            browser: deviceInfo.browser,
            deviceInfo: (deviceInfo.os && deviceInfo.browser) ? `${deviceInfo.browser} on ${deviceInfo.os}` : undefined,
        }

        return await this.refreshTokenRepository.createRefreshToken(userId, refreshTokenCreateDto);
    }
}
