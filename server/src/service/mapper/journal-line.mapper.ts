import { JournalLineEntity } from '../../domain/journal-line.entity';
import { JournalLineDTO } from '../dto/journal-line.dto';

/**
 * A JournalLine mapper object.
 */
export class JournalLineMapper {
    static fromDTOtoEntity(entityDTO: JournalLineDTO): JournalLineEntity {
        if (!entityDTO) {
            return;
        }
        const entity = new JournalLineEntity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: JournalLineEntity): JournalLineDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new JournalLineDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
