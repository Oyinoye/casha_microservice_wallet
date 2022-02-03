import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

/**
 * A DTO representing data to be sent when making a phone number verification request.
 */
export class InitiateVerifyPhoneNumberDTO {
    @ApiModelProperty({ description: 'The phone number to verify. The country code must be included, in the format "[+county code][phone number] Eg +2340XXXXXXXXX".'})
    @IsString()
	@MaxLength(15)
	@MinLength(12)
    @IsNotEmpty()
    readonly phoneNumber: string;
}
