import { BadRequestException } from "@nestjs/common";
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

export default imageUploadInterceptor;