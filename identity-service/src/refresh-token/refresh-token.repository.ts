import { Injectable } from '@nestjs/common';
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
}
