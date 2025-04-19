import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';
import { AuthModule } from 'src/auth/auth.module';
import { RefreshTokenRepository } from './refresh-token.repository';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([RefreshToken])
    ],
    controllers: [],
    providers: [RefreshTokenService, RefreshTokenRepository],
    exports: [RefreshTokenService, RefreshTokenRepository]
})
export class RefreshTokenModule { }
