import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { EmailSendOperation } from '../../utils/enums';

/**
 * A DTO representing a password change required data - current and new password.
 */
export class SendEmailDTO {
    @ApiModelProperty({ description: 'The type of email to be sent', enum: EmailSendOperation })
    @IsString()
    @IsNotEmpty()
    readonly emailType: string;

    @ApiModelProperty({ description: 'Destination email address' })
    @IsString()
    @IsNotEmpty()
	@IsEmail()
    readonly email: string;

    @ApiModelProperty({ description: 'The data for building email from template' })
    @IsNotEmpty()
    readonly data: object;
}
