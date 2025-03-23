import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MessagePattern } from "@nestjs/microservices";
import { LoginRequestDto } from "./dto/login-request.dto";

@Controller('auth')
export class AuthController {
    constructor(private authServices: AuthService) {}

    @MessagePattern({ cmd: 'validate_token'})
    async validateToken(data : {token: string}) {
        return await this.authServices.validateToken(data.token);
    }

    @Post('login')
    async login(@Body() loginRequestDto: LoginRequestDto) {
        return await this.authServices.login(loginRequestDto);
    }
}