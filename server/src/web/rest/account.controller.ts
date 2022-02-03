/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Body,
    Param,
    Post,
    Res,
    UseGuards,
    Controller,
    Get,
    Logger,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
    InternalServerErrorException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard, Roles, RoleType, RolesGuard } from '../../security';
import { PasswordChangeDTO } from '../../service/dto/password-change.dto';
import { UserDTO } from '../../service/dto/user.dto';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../../service/auth.service';
import { Client, ClientKafka } from '@nestjs/microservices';
// import { TransportConfig } from '../../transportConfig';
import { PasswordResetDTO } from '../../service/dto/password-reset.dto';
import { SendEmailDTO } from '../../service/dto/send-email.dto';
import { InitiateVerifyPhoneNumberDTO } from '../../service/dto/initiate-verify-phone-number.dto';
import { EmailSendOperation } from '../../utils/enums';
import { SendSmsDTO } from '../../service/dto/send-sms.dto';
import { VerifyPhoneNumberDTO } from '../../service/dto/verify-phone-number.dto';

@Controller('api')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiUseTags('account-resource')
export class AccountController {
    logger = new Logger('AccountController');

    constructor(private readonly authService: AuthService) {}

    // initialiase a kafka client to handle pub/sub for transports
    // @Client(TransportConfig)
    // client: ClientKafka;



    @Post('/verify/phone_number/init')
    @ApiOperation({ title: 'Initiate verify Phone number by OTP', description: 'Initiate the process if verifying a phone number by Sending an OTP to the user\'s phone number provided in the request' })
    @ApiResponse({
        status: 201,
        description: 'OTP verification token, that must be sent in the payload when verifying the OTP'
    })
    async initiateVerifyPhoneNumber(@Req() req: Request, @Body() payload: InitiateVerifyPhoneNumberDTO): Promise<any> {
        // generate otp and response payload
        const {otp, otpKey} = await this.authService.getVerifyPhoneNumberOTP(payload);
        // compose sms message
        const smsMessage = `Hello, please enter this code ${otp} to verify your phone number`;
        // build sms payload for kafka messaging
        const smsPaylaod: SendSmsDTO = {
            message: smsMessage,
            phoneNumber: payload.phoneNumber,
        };
        // use the kafka client to emmit a message to the broker with topic "send-sms" with the smsPaylaod
        // this.client.emit<any>('send-sms', smsPaylaod);
        // return the otp key to the client
        return { otpKey };
    }

    @Post('/verify/phone_number/finish')
    @ApiOperation({ title: 'Verify Phone number by OTP', description: 'Verify a phone number validating the otp provided in the request.' })
    @ApiResponse({
        status: 201,
        description: 'OTP verification token, that must be sent in the payload when verifying the OTP'
    })
    async verifyPhoneNumber(@Req() req: Request, @Body() payload: VerifyPhoneNumberDTO): Promise<any> {
        
        return await this.authService.verifyPhoneNumber(payload)
    }

    @Post('/register')
    @ApiOperation({ title: 'Register user' })
    @ApiResponse({
        status: 201,
        description: 'Registered user',
        type: UserDTO,
    })
    async registerAccount(@Req() req: Request, @Body() userDTO: UserDTO & { password: string }): Promise<any> {
        return await this.authService.registerNewUser(userDTO);
    }

    @Get('/activate')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Activate an account' })
    @ApiResponse({
        status: 200,
        description: 'activated',
    })
    activateAccount(@Param() key: string, @Res() res: Response): any {
        throw new InternalServerErrorException();
    }

    @Get('/authenticate')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Check if the user is authenticated' })
    @ApiResponse({
        status: 200,
        description: 'login authenticated',
    })
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user.login;
    }

    @Get('/account')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Get the current user.' })
    @ApiResponse({
        status: 200,
        description: 'user retrieved',
    })
    async getAccount(@Req() req: Request): Promise<any> {
        const user: any = req.user;
        const userProfileFound = await this.authService.getAccount(user.id);
        return userProfileFound;
    }

    @Post('/account')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Update the current user information' })
    @ApiResponse({
        status: 201,
        description: 'user info updated',
        type: UserDTO,
    })
    async saveAccount(@Req() req: Request, @Body() newUserInfo: UserDTO): Promise<any> {
        const user: any = req.user;
        return await this.authService.updateUserSettings(user.login, newUserInfo);
    }

    @Post('/account/change-password')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Change current password' })
    @ApiResponse({
        status: 201,
        description: 'user password changed',
        type: PasswordChangeDTO,
    })
    async changePassword(@Req() req: Request, @Body() passwordChange: PasswordChangeDTO): Promise<any> {
        const user: any = req.user;
        return await this.authService.changePassword(
            user.login,
            passwordChange.currentPassword,
            passwordChange.newPassword,
        );
    }

    @Post('/account/reset-password/init')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Send an email to reset the password of the user' })
    @ApiResponse({
        status: 201,
        description: 'mail to reset password sent',
        type: 'string',
    })
    async requestPasswordReset(@Req() req: Request, @Body() payload: PasswordResetDTO): Promise<any> {
        // perform email authentication
        const authUser = await this.authService.getAccountByEmail(payload.email);
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
        // this.client.emit<any>('send-email', emailPaylaod);

        return {message: 'Email sent!'};

    }

    @Post('/account/reset-password/finish')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Finish to reset the password of the user' })
    @ApiResponse({
        status: 201,
        description: 'password reset',
        type: 'string',
    })
    finishPasswordReset(@Req() req: Request, @Body() keyAndPassword: string, @Res() res: Response): any {
        throw new InternalServerErrorException();
    }
}
