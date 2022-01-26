import { UserEntity } from '../../domain/user.entity';
import { UserDTO } from '../dto/user.dto';

/**
 * An User mapper object.
 */
export class UserMapper {
    static fromDTOtoEntity(userDTO: UserDTO): UserEntity {
        if (!userDTO) {
            return;
        }
        const user = new UserEntity();
        const fields = Object.getOwnPropertyNames(userDTO);
        fields.forEach(field => {
            user[field] = userDTO[field];
        });
        return user;
    }

    static fromEntityToDTO(user: UserEntity): UserDTO {
        if (!user) {
            return;
        }
        const userDTO = new UserDTO();

        const fields = Object.getOwnPropertyNames(user);

        fields.forEach(field => {
            userDTO[field] = user[field];
        });

        return userDTO;
    }
}
