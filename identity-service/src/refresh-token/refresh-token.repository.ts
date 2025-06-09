import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { RefreshTokenCreateDto } from './dto/refresh-token-create.dto';

@Injectable()
export class RefreshTokenRepository {
    constructor(@InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>) { }

    async createRefreshToken(userId: number, refreshTokenDto: RefreshTokenCreateDto): Promise<RefreshToken> {
        const refreshToken = this.refreshTokenRepository.create(refreshTokenDto);
        return await this.refreshTokenRepository.save(refreshToken);
    }

    async findTokensByUserId(userId: number): Promise<RefreshToken[]> {
        return await this.refreshTokenRepository.find({
            where: {
                user: {
                    id: userId
                },
                revoked: false
            }
        });
    }

    async findRefreshTokensByToken(token: string): Promise<RefreshToken> {
        const refresh = await this.refreshTokenRepository.findOne({
            where: {
                token: token,
                revoked: false
            },
            relations: {
                user: true
            }
        });

        if (!refresh) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return refresh;
    }

    async revokedRefreshToken(tokenId: number): Promise<void> {
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: {
                id: tokenId,
            }
        })

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        await this.refreshTokenRepository.update({ id: tokenId }, { revoked: true });
    }
}
