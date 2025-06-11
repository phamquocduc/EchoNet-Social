import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ValidatedTokenResponseDto } from "./dto/validated-token-response.dto";
import { LoginRequestDto } from "./dto/login-request.dto";
import { UserRepository } from "src/user/user.repository";
import * as bcrypt from 'bcrypt';
import { User } from "src/user/user.entity";
import { randomUUID } from 'crypto';
import { async } from "rxjs";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { RefreshTokenCreateDto } from "src/refresh-token/dto/refresh-token-create.dto";
import { RefreshToken } from "src/refresh-token/refresh-token.entity";
import { DeviceInfoDto } from "./dto/device-infor.dto";
import { ClientProxy } from "@nestjs/microservices";
import { VerifyMailRequestDto } from "./dto/verify-mail-request.dto";
import { ForgotPasswordRequestDto } from "./dto/send-forgot-password.dto";

@Injectable()
export class AuthService {
    constructor(private jwtServices: JwtService,
        private readonly userRepository: UserRepository,
        private readonly refreshTokenService: RefreshTokenService,
        @Inject('MAIL_SERVICE') private readonly mailClient: ClientProxy,
    ) { }

    async validateToken(token: string): Promise<ValidatedTokenResponseDto> {
        try {
            console.log('Token in identity:', token);
            const payload = await this.jwtServices.verifyAsync(token, {
                secret: process.env.SECRET_KEY_JWT,
            });

            return {
                valid: true,
                code: 200,
                payload: payload,
            };
        } catch (error) {
            return {
                valid: false,
                code: 401,
                payload: null,
            }
        }
    }

    async getPayload(token: string): Promise<any | undefined> {
        try {
            const decoded = await this.jwtServices.verifyAsync(token, { ignoreExpiration: true });

            return decoded
        } catch (error) {
            throw error;
        }
    }


    async login(loginRequestDto: LoginRequestDto, deviceInfo: DeviceInfoDto): Promise<{ access_token: string, refresh_token: string }> {

        const { email, password } = loginRequestDto;

        const user = await this.userRepository.findOneByEmail(email);

        if (!user) {
            throw new BadRequestException(`User with email ${email} not found`)
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new BadRequestException('password is incorrect');
        }

        const refreshToken = await this.refreshTokenService.createRefreshToken(user.id, deviceInfo)

        return {
            access_token: await this.generateToken(user),
            refresh_token: refreshToken.token
        }
    }

    async verifyEmail(verifyEmailDto: VerifyMailRequestDto): Promise<void> {
        this.mailClient.emit('mail.send.verify', verifyEmailDto)
    }

    async sendForgotPassword(forgotPasswordDto: ForgotPasswordRequestDto): Promise<void> {
        this.mailClient.emit('mail.send.forgot-password', forgotPasswordDto)
    }

    async refreshToken(refreshToken: string, user: User, currentRefreshToken: RefreshToken): Promise<{ access_token: string, refresh_token: string }> {
        return {
            access_token: await this.generateToken(user),
            refresh_token: await this.refreshTokenService.renewRefreshToken(refreshToken, currentRefreshToken)
        }
    }

    async generateToken(user: User): Promise<string> {
        const payload = { sub: user.id, userEmail: user.email, role: user.role.roleName }

        return await this.jwtServices.signAsync(payload)
    }

    generateVerifyCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}