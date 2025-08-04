import { Controller } from "@nestjs/common";
import { UserService } from "../user.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class UserExternalController {
    constructor(
        private readonly userService: UserService
    ) { }

    @MessagePattern({ cmd: 'check_user_exited' })
    async checkUserExited(data: { userId: number }): Promise<boolean> {
        return await this.userService.checkUserExited(data.userId);
    }
}