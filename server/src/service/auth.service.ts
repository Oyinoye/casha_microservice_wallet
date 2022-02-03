import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../service/dto/user-login.dto';
import { Payload } from '../security/payload.interface';
import * as bcrypt from 'bcrypt';
import { AuthorityRepository } from '../repository/authority.repository';
import { UserService } from '../service/user.service';
import { UserDTO } from './dto/user.dto';
import { FindManyOptions } from 'typeorm';
import { decode, encode, generateOtp } from '../utils/helper.service';
import { generateOtpDTO } from './dto/generate-otp.dto';
import { OtpStatus, OtpTypes, OtpUsage } from '../utils/enums';
import { OtpRepository } from '../repository/otp-repository';
import { InitiateVerifyPhoneNumberDTO } from './dto/initiate-verify-phone-number.dto';
import { VerifyPhoneNumberDTO } from './dto/verify-phone-number.dto';

@Injectable()
export class AuthService {
    logger = new Logger('AuthService');
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
        @InjectRepository(OtpRepository) private otpRepository: OtpRepository,
        private userService: UserService,
    ) { }

    async login(userLogin: UserLoginDTO): Promise<any> {
        const loginUserName = userLogin.username;
        const loginPassword = userLogin.password;

        const userFind = await this.userService.findByFields({ where: { login: loginUserName } });
        const validPassword = !!userFind && (await bcrypt.compare(loginPassword, userFind.password));
        if (!userFind || !validPassword) {
            throw new HttpException('Invalid login name or password!', HttpStatus.BAD_REQUEST);
        }

        if (userFind && !userFind.activated) {
            throw new HttpException('Your account is not been activated!', HttpStatus.BAD_REQUEST);
        }

        const user = await this.findUserWithAuthById(userFind.id);

        const payload: Payload = { id: user.id, username: user.login, authorities: user.authorities };

        /* eslint-disable */
        return {
            id_token: this.jwtService.sign(payload),
        };
    }

    /* eslint-enable */
    async validateUser(payload: Payload): Promise<UserDTO | undefined> {
        return await this.findUserWithAuthById(payload.id);
    }

    async findUserWithAuthById(userId: number): Promise<UserDTO | undefined> {
        const userDTO: UserDTO = await this.userService.findByFields({ where: { id: userId } });
        return userDTO;
    }

    async getAccount(userId: number): Promise<UserDTO | undefined> {
        const userDTO: UserDTO = await this.findUserWithAuthById(userId);
        if (!userDTO) {
            return;
        }
        return userDTO;
    }

    async getAccountByEmail(email: string): Promise<any> {
        const userFind: UserDTO = await this.userService.findByFields({ where: { email } });
        if (!userFind) {
            throw new HttpException('Email not found', HttpStatus.BAD_REQUEST);
        }
        return userFind;
    }

    async changePassword(userLogin: string, currentClearTextPassword: string, newPassword: string): Promise<void> {
        const userFind: UserDTO = await this.userService.findByFields({ where: { login: userLogin } });
        if (!userFind) {
            throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
        }

        if (!(await bcrypt.compare(currentClearTextPassword, userFind.password))) {
            throw new HttpException('Invalid password!', HttpStatus.BAD_REQUEST);
        }
        userFind.password = newPassword;
        await this.userService.save(userFind, userLogin, true);
        return;
    }

    async registerNewUser(newUser: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.userService.findByFields({ where: { login: newUser.login } });
        if (userFind) {
            throw new HttpException('Login name already used!', HttpStatus.BAD_REQUEST);
        }
        userFind = await this.userService.findByFields({ where: { email: newUser.email } });
        if (userFind) {
            throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
        }
        newUser.authorities = ['ROLE_USER'];
        const user: UserDTO = await this.userService.save(newUser, newUser.login, true);
        return user;
    }

    async updateUserSettings(userLogin: string, newUserInfo: UserDTO): Promise<UserDTO> {
        const userFind: UserDTO = await this.userService.findByFields({ where: { login: userLogin } });
        if (!userFind) {
            throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
        }
        const userFindEmail: UserDTO = await this.userService.findByFields({ where: { email: newUserInfo.email } });
        if (userFindEmail && newUserInfo.email !== userFind.email) {
            throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
        }

        userFind.firstName = newUserInfo.firstName;
        userFind.lastName = newUserInfo.lastName;
        userFind.email = newUserInfo.email;
        userFind.langKey = newUserInfo.langKey;
        await this.userService.save(userFind, userLogin);
        return;
    }

    async getAllUsers(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
        return await this.userService.findAndCount(options);
    }

    async getVerifyPhoneNumberOTP(payload:InitiateVerifyPhoneNumberDTO): Promise<any> {

        // check if phone number has already been used by another user
        const userFind: UserDTO = await this.userService.findByFields({ where: { phoneNumber: payload.phoneNumber } });
        if (userFind) {
            throw new HttpException(`This phone number ${payload.phoneNumber} has already been used by another user`, HttpStatus.BAD_REQUEST);
        }

        // generate otp for phone number verification
        const otp_generation_options: generateOtpDTO = {size: 4, validityDuration: 90 }

        const {otp, timestamp, expiration_time} = await generateOtp(otp_generation_options);
        console.log(expiration_time);

        //Create OTP instance in DB
        const otp_instance = await this.otpRepository.save({
            otp,
            usage: OtpUsage.VERIFY_PHONE_NUMBER,
            type: OtpTypes.PHONE_NUMBER,
            expirationTime: expiration_time,
            status: OtpStatus.UNUSED
        });

        // Create details object containing the phone number and otp id
        var details = {
            "timestamp": timestamp,
            "subject": payload.phoneNumber,
            "type": OtpTypes.PHONE_NUMBER,
            "otp_id": otp_instance.id
        }

        // Encrypt the details object
        const otpKey = await encode(JSON.stringify(details))
        return {otp, otpKey}
    }

    async verifyPhoneNumber(payload: VerifyPhoneNumberDTO): Promise<any> {

        // Decrypt the otpkey into otp deails object
        const otp_key_info = JSON.parse(await decode(payload.otpKey));

        // check if otp is valid (unused and not expired)
        // get otp info
        const otpObj = await this.otpRepository.findOne(Number(otp_key_info.otp_id))
        const now = new Date();
        if(!otpObj || (now.getSeconds() > otpObj.expirationTime) || otpObj.otp !== payload.otp)
            throw new HttpException(`OTP is invalid`, HttpStatus.BAD_REQUEST);

        // check that otp has not been used
        if(otpObj.status === OtpStatus.USED)
            throw new HttpException(`OTP has already been used`, HttpStatus.BAD_REQUEST);

        // set otp status to used
        otpObj.status = OtpStatus.USED;
        await this.otpRepository.update(otp_key_info.otp_id, otpObj);

        // To-Do: Run check of phone number in other MAX databased to pull associated basic bio information

        return { phoneNumber: otp_key_info.subject, verified: true }
        
    }
}
