import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, isNumberString, IsNumberString, IsEmail } from 'class-validator';
import { KinRelationship } from '../../utils/enums';
import { CustomerDTO } from './customer.dto';

/**
 * A DTO representing data to be sent when adding Next of Kin.
 */
export class NextOfKinDTO {
	@ApiModelProperty({ example: 'John', description: 'Next of Kin first name' })
    firstName: string;

    @ApiModelProperty({ example: 'Doe', description: 'Next of Kin last name' })
    lastName: string;

    @ApiModelProperty({ example: 'myuser@localhost.it', description: 'Next of Kin email' })
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'Next of Kin phoneNumber' })
    phoneNumber: string;

    @ApiModelProperty({ description: 'Next of Kin nationality' })
    nationality: string;

    @ApiModelProperty({ description: 'Next of Kin address' })
    address: string;

    @ApiModelProperty({ description: 'User relationship with next of kin', enum: KinRelationship })
    relationship: string;

    @ApiModelProperty({ type: CustomerDTO, description: 'customer relationship' })
    customer: CustomerDTO;
}
