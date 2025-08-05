export class VerifyMailDto {
    email: string;
    code: string;
    expiresAt: Date;
    createdAt: Date;
    used: boolean;
}