import { BillerEntity } from '../../domain/biller.entity';
import { BillerDTO } from '../dto/biller.dto';

/**
 * A Biller mapper object.
 */
export class BillerMapper {
    static fromDTOtoEntity(entityDTO: BillerDTO): BillerEntity {
        if (!entityDTO) {
            return;
        }
        const entity = new BillerEntity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: BillerEntity): BillerDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new BillerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
