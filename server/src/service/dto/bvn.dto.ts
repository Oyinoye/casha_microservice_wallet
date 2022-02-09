import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, isNumberString, IsNumberString } from 'class-validator';

/**
 * A DTO representing data to be sent when adding BVN.
 */
export class BvnDTO {
    @ApiModelProperty({ description: 'The user\'s Bank Verification Number, must an 11 digit number.'})
    @IsNumberString()
	@MaxLength(11)
	@MinLength(11)
    @IsNotEmpty()
    readonly bvn: number;
}
