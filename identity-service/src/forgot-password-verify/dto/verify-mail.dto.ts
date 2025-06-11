export class ForgotPasswordVerifyDto {
    email: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    used: boolean;
}