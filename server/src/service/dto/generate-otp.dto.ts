import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Max, Min } from 'class-validator';
import { OtpTypes, OtpUsage } from '../../utils/enums';

/**
 * A DTO representing data to be sent when making a phone number verification request.
 */
export class generateOtpDTO {
    @ApiModelProperty({ type:'number', description: 'Time in seconds for which the generated otp is to be valid'})
    @IsString()
    @IsNotEmpty()
	readonly validityDuration: number

    @ApiModelProperty({ type: 'number', description: 'The number of digits for the otp to have'})
    @IsString()
    @IsNotEmpty()
	readonly size:number
}
