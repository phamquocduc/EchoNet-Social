import {
    Controller,
    Post,
    Delete,
    Body,
    Req,
    Param
} from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('friendship')
export class FriendshipController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('request/:userId')
    async sendFriendRequest(@Req() request: Request, @Param('userId') toUserId: string) {
        const fromUserId = request['user'].sub;

        await this.profileService.sendFriendRequest(Number.parseInt(fromUserId), Number.parseInt(toUserId))
        return { message: 'Friend request sent' };
    }

    @Post('accept/:userId')
    async acceptFriendRequest(@Req() request: Request, @Param('userId') toUserId: string) {
        const fromUserId = request['user'].sub;

        await this.profileService.acceptFriendRequest(Number.parseInt(fromUserId), Number.parseInt(toUserId));
        return { message: 'Friend request accepted' };
    }

    @Delete('reject/:userId')
    async rejectFriendRequest(@Req() request: Request, @Param('userId') toUserId: string) {
        const fromUserId = request['user'].sub;

        await this.profileService.rejectFriendRequest(Number.parseInt(fromUserId), Number.parseInt(toUserId));
        return { message: 'Friend request rejected' };
    }

    @Delete('cancel/:userId')
    async cancelFriendRequest(@Req() request: Request, @Param('userId') toUserId: string) {
        const fromUserId = request['user'].sub;

        await this.profileService.cancelFriendRequest(Number.parseInt(fromUserId), Number.parseInt(toUserId));
        return { message: 'Friend request cancelled' };
    }

    @Delete('unfriend/:userId')
    async unfriend(@Req() request: Request, @Param('userId') toUserId: string) {
        const fromUserId = request['user'].sub;

        await this.profileService.unfriend(Number.parseInt(fromUserId), Number.parseInt(toUserId));
        return { message: 'Unfriended successfully' };
    }

    @Post('follow/:userId')
    async followPage(@Req() request: Request, @Param('userId') toUserId: string) {
        const fromUserId = request['user'].sub;

        await this.profileService.followPage(Number.parseInt(fromUserId), Number.parseInt(toUserId));
        return { message: 'Page followed' };
    }

    @Delete('unfollow/:userId')
    async unfollowPage(@Req() request: Request, @Param('userId') toUserId: string) {
        const fromUserId = request['user'].sub;

        await this.profileService.unfollowPage(Number.parseInt(fromUserId), Number.parseInt(toUserId));
        return { message: 'Page unfollowed' };
    }

}
