import { BadRequestException } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

export const MediaUploadInterceptor = FilesInterceptor('files', 10, {
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'video/mp4',
            'video/webm',
            'video/quicktime',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new BadRequestException(
                    'Only JPG, PNG, WEBP, MP4, MOV, and WEBM files are allowed',
                ),
                false,
            );
        }

        cb(null, true);
    },
});

export const imageUploadInterceptor = FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return cb(new BadRequestException('Only JPG/PNG/WEBP allowed'), false);
        }
        cb(null, true);
    },
});
