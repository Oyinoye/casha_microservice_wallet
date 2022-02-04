import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserJWTController } from '../web/rest/user.jwt.controller';
import { config } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityRepository } from '../repository/authority.repository';

import { PublicUserController } from '../web/rest/public.user.controller';
import { AccountController } from '../web/rest/account.controller';
import { OtpRepository } from '../repository/otp-repository';
import { CustomerModule } from './customer.module';
import { WalletModule } from './wallet.module';
import { KafkaModule } from './kafka.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthorityRepository, OtpRepository]),
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: config['jhipster.security.authentication.jwt.base64-secret'],
            signOptions: { expiresIn: '300s' },
        }),
        CustomerModule, WalletModule, KafkaModule
    ],
    controllers: [UserJWTController, PublicUserController, AccountController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
