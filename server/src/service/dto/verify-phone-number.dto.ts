import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

/**
 * A DTO representing data to be sent when making a phone number verification request.
 */
export class VerifyPhoneNumberDTO {
	@ApiModelProperty({ description: 'The otp value sent to a user via sms'})
    @IsString()
	@MaxLength(4)
	@MinLength(4)
    @IsNotEmpty()
    otp: string

	@ApiModelProperty({ description: 'A string representing an encrypted set of information about the otp received from the backend when the otp from requested'})
    @IsString()
    @IsNotEmpty()
	otpKey: string

}
