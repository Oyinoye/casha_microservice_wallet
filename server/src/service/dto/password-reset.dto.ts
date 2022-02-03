import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

/**
 * A DTO representing a password change required data - current and new password.
 */
export class PasswordResetDTO {
    @ApiModelProperty({ description: 'User\'s email' })
    @IsString()
    @IsNotEmpty()
	@IsEmail()
    readonly email: string;
}
