import { BadRequestException, Controller, Get, InternalServerErrorException, Put, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileUpdateDto } from "./dto/profile-update.dto";
import { Profile } from "./profile.entity";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";


const imageUploadInterceptor = FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return cb(new BadRequestException('Only JPG/PNG/WEBP allowed'), false);
        }
        cb(null, true);
    },
});

@Controller('personal')
export class ProfileController {
    constructor(private readonly profileService: ProfileService,
        private readonly cloudinarySevices: CloudinaryService,
    ) { }

    @Get()
    async getProfile(@Req() req: Request): Promise<Profile> {
        const userId = req['user'].sub;
        console.log('userid:', userId);

        return await this.profileService.findProfileByUserId(userId);
    }

    @Put('update-profile')
    async updateProfile(@Req() req: Request, profileUpdateDto: ProfileUpdateDto): Promise<Profile> {
        const userId = req['user'].sub;
        return await this.profileService.updateProfile(userId, profileUpdateDto);
    }

    @Put('update/avatar')
    @UseInterceptors(imageUploadInterceptor)
    async updateAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ): Promise<Profile> {
        const userId = req['user'].sub;
        console.log(file);
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        try {
            const uploadResult = await this.cloudinarySevices.uploadFile(file, {
                folder: 'avatars',
                public_id: `avatar_${userId}`,
                transformation: [
                    { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            });

            const updateProfileDto: ProfileUpdateDto = {
                avatar: uploadResult.secure_url,
            };

            await this.profileService.updateProfile(userId, updateProfileDto);

            return this.profileService.findProfileByUserId(userId);
        } catch (err) {
            console.error(err);
            throw new InternalServerErrorException('Failed to update avatar');
        }
    }

    @Put('update/cover-photo')
    @UseInterceptors(imageUploadInterceptor)
    async updateCoverPhoto(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ): Promise<Profile> {
        const userId = req['user'].sub;
        console.log(file);
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        try {
            const uploadResult = await this.cloudinarySevices.uploadFile(file, {
                folder: 'cover-photos',
                public_id: `cover_${userId}`,
                transformation: [
                    { width: 1200, height: 400, crop: 'fill', gravity: 'auto' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            }
            );

            const updateProfileDto: ProfileUpdateDto = {
                coverphoto: uploadResult.secure_url,
            };

            await this.profileService.updateProfile(userId, updateProfileDto);

            return this.profileService.findProfileByUserId(userId);
        } catch (err) {
            console.error(err);
            throw new InternalServerErrorException('Failed to update avatar');
        }
    }
}