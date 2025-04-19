import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/login-request.dto";
import { Public } from "./decorators/isPublic.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
import { UserCreateDto } from "src/user/dto/user-create.dto";
import * as UAParser from 'ua-parser-js';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authServices: AuthService,
        private readonly userService: UserService
    ) { }

    @Public()
    @Post('login')
    async login(@Req() req: Request, @Body() loginRequestDto: LoginRequestDto) {
        const userAgent = req.headers['user-agent'] || '';
        const parser = new UAParser.UAParser(userAgent);

        const deviceInfo = {
            browser: parser.getBrowser().name || null,
            os: parser.getOS().name || null,
        };

        console.log('Device Info:', deviceInfo);

        return await this.authServices.login(loginRequestDto, deviceInfo);
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
        const userGmail = req.user
        const user = await this.userService.userGetByEmail(userGmail.email)

        if (user) {
            if (user.isVerified === false) {
                await this.userService.updateUserisVerified(user.id)
            }
            return await this.authServices.generateToken(user)
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

            await this.userService.updateUserisVerified(newUser.id)

            return await this.authServices.generateToken(newUser)
        }
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