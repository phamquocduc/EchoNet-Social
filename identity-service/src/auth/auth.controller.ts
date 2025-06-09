import { BadRequestException, Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/login-request.dto";
import { Public } from "./decorators/isPublic.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
import { UserCreateDto } from "src/user/dto/user-create.dto";
import * as UAParser from 'ua-parser-js';
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { RefreshTokenCreateDto } from "src/refresh-token/dto/refresh-token-create.dto";
import { RefreshTokenRequestDto } from "./dto/refresh-token-request.dto";
import { DeviceInfoDto } from "./dto/device-infor.dto";
import { User } from "src/user/user.entity";
import { ClientProxy } from "@nestjs/microservices";
import { VerifyMailDto } from "src/verify-email/dto/verify-mail.dto";
import { VerifyMailService } from "src/verify-email/verify-mail.service";
import { VerifyEmail } from "src/verify-email/verify-email.entity";
import { VerifyMailRequestDto } from "./dto/verify-mail-request.dto";
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authServices: AuthService,
        private readonly userService: UserService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly verifyMailService: VerifyMailService,
    ) { }

    @Public()
    @Post('login')
    async login(@Req() req: Request, @Body() loginRequestDto: LoginRequestDto) {
        const userAgent = req.headers['user-agent'] || '';
        const parser = new UAParser.UAParser(userAgent);

        const deviceInfo: DeviceInfoDto = {
            browser: parser.getBrowser().name || undefined,
            os: parser.getOS().name || undefined,
        };

        console.log('Device Info:', deviceInfo);

        return await this.authServices.login(loginRequestDto, deviceInfo);
    }

    @Post('register')
    @Public()
    async create(@Body() userCreation: UserCreateDto): Promise<VerifyEmail> {

        const DateNow = new Date(Date.now())

        const verifyEmailEntity: VerifyMailDto = {
            email: userCreation.email,
            code: this.authServices.generateVerifyCode(),
            createdAt: DateNow,
            expiresAt: new Date(DateNow.getTime() + 2 * 60 * 1000),
            used: false,
        }

        await this.userService.createUser(userCreation)

        const verifyEmailDto: VerifyMailRequestDto = {
            email: verifyEmailEntity.email,
            code: verifyEmailEntity.code,
        }

        await this.authServices.verifyEmail(verifyEmailDto)
        return await this.verifyMailService.createVerifyEmail(verifyEmailEntity)
    }

    @Post('verify-email')
    @Public()
    async verifycode(@Req() req: Request, @Body() verifyMailReqDto: VerifyMailRequestDto): Promise<{ access_token: string, refresh_token: string }> {

        const userAgent = req.headers['user-agent'] || '';
        const parser = new UAParser.UAParser(userAgent);

        const deviceInfo: DeviceInfoDto = {
            browser: parser.getBrowser().name || undefined,
            os: parser.getOS().name || undefined,
        };

        const DateNow = new Date(Date.now())

        const verifyMail = await this.verifyMailService.findVerifyEmailByEmail(verifyMailReqDto.email)
        if (verifyMail.code !== verifyMailReqDto.code) {
            throw new BadRequestException('Invalid code')
        } else {
            if (verifyMail.expiresAt < DateNow) {
                throw new BadRequestException('Code expired')
            }

            const user = await this.userService.userGetByEmail(verifyMail.email)
            await this.userService.updateUserisVerified(user.email)
            await this.userService.defaulProfile(user.id, user.fullName)
            await this.verifyMailService.updateVerifyEmail(verifyMail.id)

            return {
                access_token: await this.authServices.generateToken(user),
                refresh_token: (await this.refreshTokenService.createRefreshToken(user.id, deviceInfo)).token
            }
        }
    }

    @Public()
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
    }

    @Public()
    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req: any) {
        const userAgent = req.headers['user-agent'] || '';
        const parser = new UAParser.UAParser(userAgent);

        const deviceInfo: DeviceInfoDto = {
            browser: parser.getBrowser().name || undefined,
            os: parser.getOS().name || undefined,
        };

        const userGmail = req.user
        const user = await this.userService.userGetByEmail(userGmail.email)

        if (user) {
            if (user.isVerified === false) {
                await this.userService.updateUserisVerified(user.email)
            }
            return {
                access_token: await this.authServices.generateToken(user),
                refresh_token: await this.refreshTokenService.createRefreshToken(user.id, deviceInfo)
            }
        } else {

            const password = this.generateRandomString(10)

            console.log('password', password)

            const createUser: UserCreateDto = {
                email: userGmail.email,
                password: password,
                confirmPassword: password,
                fullname: userGmail.name,
            }

            const newUser = await this.userService.createUser(createUser)

            await this.userService.updateUserisVerified(newUser.email)

            return {
                access_token: await this.authServices.generateToken(newUser),
                refresh_token: await this.refreshTokenService.createRefreshToken(newUser.id, deviceInfo)
            }
        }
    }

    @Public()
    @Post('refresh-token')
    async refreshToken(@Body() refreshToken: RefreshTokenRequestDto) {
        const currentRefreshToken = await this.refreshTokenService.getRefreshTokenByToken(refreshToken.token);

        return await this.authServices.refreshToken(refreshToken.token, currentRefreshToken.user, currentRefreshToken);
    }

    private generateRandomString(length = 10): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}