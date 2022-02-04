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
import { EmailSendOperation, OtpStatus, OtpTypes, OtpUsage } from '../utils/enums';
import { OtpRepository } from '../repository/otp-repository';
import { InitiateVerifyPhoneNumberDTO } from './dto/initiate-verify-phone-number.dto';
import { VerifyPhoneNumberDTO } from './dto/verify-phone-number.dto';
import { UserMapper } from './mapper/user.mapper';
import { UserEntity } from '../domain/user.entity';
import { WalletDTO } from './dto/wallet.dto';
import { WalletEntity } from '../domain/wallet.entity';
import { CustomerService } from './customer.service';
import { CustomerDTO } from './dto/customer.dto';
import { CustomerEntity } from '../domain/customer.entity';
import { WalletType } from '../domain/enumeration/wallet-type';
import { WalletStatus } from '../domain/enumeration/wallet-status';
import { WalletService } from './wallet.service';
import { PasswordResetDTO } from './dto/password-reset.dto';
import { SendEmailDTO } from './dto/send-email.dto';
import { ProducerService } from './producer.service';
import { SendSmsDTO } from './dto/send-sms.dto';

@Injectable()
export class AuthService {
    logger = new Logger('AuthService');
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
        @InjectRepository(OtpRepository) private otpRepository: OtpRepository,
        private userService: UserService,
        private customerService: CustomerService,
        private walletService: WalletService,
        private producerService: ProducerService
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
            throw new HttpException(`User with email "${email}" not found`, HttpStatus.BAD_REQUEST);
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

    async initResetPassword(payload: PasswordResetDTO ): Promise<any> {

        // perform email authentication
        const authUser = await this.getAccountByEmail(payload.email);
        if(!authUser)
            throw new HttpException(`User with email "${payload.email}" not found`, HttpStatus.BAD_REQUEST);

        // generate terminal password reset link and include it in the email payload data
        // To-Do

        const emailPaylaod: SendEmailDTO = {
            data: authUser,
            email: payload.email,
            emailType: EmailSendOperation.RESET_PASSWORD,
        };
        // use the kafka client to emmit a message to the broker with topic "send-email" with the email emailPaylaod
        await this.producerService.produce({topic: 'send-email', messages: [{value: JSON.stringify(emailPaylaod)}]});

        return {message: 'Email sent!'};  
    }

    async initVerifyPhoneNumber(payload:InitiateVerifyPhoneNumberDTO): Promise<any> {

        // check if phone number has already been used by another user
        const cutomerFind: CustomerDTO = await this.customerService.findByFields({ where: { phoneNumber: payload.phoneNumber } });
        if (cutomerFind) {
            throw new HttpException(`This phone number ${payload.phoneNumber} has already been used by another user`, HttpStatus.BAD_REQUEST);
        }

        // generate otp for phone number verification
        const otp_generation_options: generateOtpDTO = {size: 4, validityDuration: 90 }
        const {otp, timestamp, expiration_time} = await generateOtp(otp_generation_options);

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
        
        // compose sms message
        const smsMessage = `Hello, please enter this code ${otp} to verify your phone number`;
        // build sms payload for kafka messaging
        const smsPaylaod: SendSmsDTO = {
            message: smsMessage,
            phoneNumber: payload.phoneNumber,
        };
        // use the kafka client to emmit a message to the broker with topic "send-sms" with the smsPaylaod
        await this.producerService.produce({topic: 'send-sms', messages: [{value: JSON.stringify(smsPaylaod)}]});
        // return the otp key to the client
        return { otpKey };
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

        // create barebone user profile
        const newUserData:UserDTO = new UserEntity;
        newUserData.authorities = ['ROLE_USER'];

        // To-Do: Run check of phone number in other MAX databased to pull associated basic bio information

        // save newUserData to create a new user profile
        const newUser = await this.userService.save(newUserData, otp_key_info.subject.replace("+", ""), true);
        if(!newUser || !newUser.id)
            return { phoneNumber: otp_key_info.subject }
        
        // set otp status to used after user is created
        otpObj.status = OtpStatus.USED;
        await this.otpRepository.update(otp_key_info.otp_id, otpObj);

        // create customer record for user
        const userCustomerData:CustomerDTO = new CustomerEntity;
        userCustomerData.phoneNumber = otp_key_info.subject;
        userCustomerData.user = newUser;
        const userCustomer = await this.customerService.save(userCustomerData, otp_key_info.subject.replace("+", ""));
        if(!userCustomer || !userCustomer.id)
            return { ...newUser }

        // create wallet for user
        const userCustomerWalletData: WalletDTO = new WalletEntity;
        userCustomerWalletData.customer = userCustomer;
        userCustomerWalletData.type = WalletType.CustomerWallet;
        userCustomerWalletData.status = WalletStatus.Inactive;
        const userCustomerWallet = await this.walletService.save(userCustomerWalletData, otp_key_info.subject.replace("+", ""));
        if(!userCustomerWallet || !userCustomerWallet.id)
            return {...userCustomer}

        return userCustomerWallet
        
    }
}
