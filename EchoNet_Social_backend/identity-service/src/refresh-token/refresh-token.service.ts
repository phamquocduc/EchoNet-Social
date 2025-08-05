import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RefreshTokenCreateDto } from './dto/refresh-token-create.dto';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenRepository } from './refresh-token.repository';
import { DeviceInfoDto } from 'src/auth/dto/device-infor.dto';

@Injectable()
export class RefreshTokenService {

    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) { }

    generateTokenUUID(): string {
        return randomUUID()
    }

    async createRefreshToken(userId: number, deviceInfo: DeviceInfoDto): Promise<RefreshToken> {
        const refreshTokenUUID = this.generateTokenUUID();

        const userTokens = await this.refreshTokenRepository.findTokensByUserId(userId);

        if (userTokens.length >= 5) {
            const oldestToken = userTokens.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
            await this.refreshTokenRepository.revokedRefreshToken(oldestToken.id);
        }

        const refreshTokenCreateDto: RefreshTokenCreateDto = {
            token: refreshTokenUUID,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now()),
            os: deviceInfo.os,
            browser: deviceInfo.browser,
            deviceInfo: (deviceInfo.os && deviceInfo.browser) ? `${deviceInfo.browser} on ${deviceInfo.os}` : undefined,
        };

        return await this.refreshTokenRepository.createRefreshToken(userId, refreshTokenCreateDto);
    }

    async renewRefreshToken(token: string, currentRefreshToken: RefreshToken): Promise<string> {
        const refreshTokenUUID = this.generateTokenUUID();

        const refreshTokenCreateDto: RefreshTokenCreateDto = {
            token: refreshTokenUUID,
            expiresAt: currentRefreshToken.expiresAt,
            createdAt: new Date(Date.now()),
            os: currentRefreshToken.os,
            browser: currentRefreshToken.browser,
            deviceInfo: currentRefreshToken.deviceInfo,
        };

        await this.refreshTokenRepository.revokedRefreshToken(currentRefreshToken.id);

        const newRefreshToken = await this.refreshTokenRepository.createRefreshToken(currentRefreshToken.user.id, refreshTokenCreateDto);

        return newRefreshToken.token;
    }

    async getRefreshTokenByToken(token: string): Promise<RefreshToken> {
        return await this.refreshTokenRepository.findRefreshTokensByToken(token);
    }
}
