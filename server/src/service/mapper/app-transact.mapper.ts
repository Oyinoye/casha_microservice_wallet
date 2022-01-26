import { AppTransactEntity } from '../../domain/app-transact.entity';
import { AppTransactDTO } from '../dto/app-transact.dto';

/**
 * A AppTransact mapper object.
 */
export class AppTransactMapper {
    static fromDTOtoEntity(entityDTO: AppTransactDTO): AppTransactEntity {
        if (!entityDTO) {
            return;
        }
        const entity = new AppTransactEntity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: AppTransactEntity): AppTransactDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new AppTransactDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
