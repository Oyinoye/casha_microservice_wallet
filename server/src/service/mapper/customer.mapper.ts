import { CustomerEntity } from '../../domain/customer.entity';
import { CustomerDTO } from '../dto/customer.dto';

/**
 * A Customer mapper object.
 */
export class CustomerMapper {
    static fromDTOtoEntity(entityDTO: CustomerDTO): CustomerEntity {
        if (!entityDTO) {
            return;
        }
        const entity = new CustomerEntity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: CustomerEntity): CustomerDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new CustomerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
