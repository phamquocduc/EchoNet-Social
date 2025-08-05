export class RefreshTokenCreateDto {

    token: string;

    expiresAt: Date;

    createdAt: Date;

    deviceInfo?: string;

    browser?: string;

    os?: string;
}
