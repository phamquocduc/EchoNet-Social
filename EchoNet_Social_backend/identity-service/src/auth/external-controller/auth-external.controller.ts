import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AuthService } from "../auth.service";

@Controller()
export class AuthExternalController {
    constructor(private readonly authServices: AuthService) { }

    @MessagePattern({ cmd: 'validate_token' })
    async validateToken(data: { token: string }) {
        return await this.authServices.validateToken(data.token);
    }
}