import { JournalEntity } from '../../domain/journal.entity';
import { JournalDTO } from '../dto/journal.dto';

/**
 * A Journal mapper object.
 */
export class JournalMapper {
    static fromDTOtoEntity(entityDTO: JournalDTO): JournalEntity {
        if (!entityDTO) {
            return;
        }
        const entity = new JournalEntity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: JournalEntity): JournalDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new JournalDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
