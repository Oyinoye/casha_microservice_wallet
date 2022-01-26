import { WalletEntity } from '../../domain/wallet.entity';
import { WalletDTO } from '../dto/wallet.dto';

/**
 * A Wallet mapper object.
 */
export class WalletMapper {
    static fromDTOtoEntity(entityDTO: WalletDTO): WalletEntity {
        if (!entityDTO) {
            return;
        }
        const entity = new WalletEntity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: WalletEntity): WalletDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new WalletDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
