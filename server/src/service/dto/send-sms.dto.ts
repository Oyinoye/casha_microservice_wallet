import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Max, Min } from 'class-validator';

/**
 * A DTO representing a password change required data - current and new password.
 */
export class SendSmsDTO {
    @ApiModelProperty({ description: 'The message to be sent'})
    @IsString()
    @IsNotEmpty()
    readonly message: string;

    @ApiModelProperty({ description: 'The phone number to verify. The country code must be included, in the format "[+county code][phone number] Eg +2340XXXXXXXXX".'})
    @IsString()
	@Max(15)
	@Min(12)
    @IsNotEmpty()
    readonly phoneNumber: string;
}
