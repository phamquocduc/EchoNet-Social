import { Module, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IDENTITY_SERVICE } from './constants/constants';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === 'production'
                    ? '.env.production'
                    : '.env.local',
        }),
        ClientsModule.registerAsync([
            {
                name: IDENTITY_SERVICE,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        port: Number(configService.get('IDENTITY_TCP_PORT')),
                    },
                }),
            },
        ])
    ],
    controllers: [],
    exports: [ClientsModule]
})
export class ClientsModuleProxy {
}
