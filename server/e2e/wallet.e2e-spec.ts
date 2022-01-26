import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { WalletDTO } from '../src/service/dto/wallet.dto';
import { WalletService } from '../src/service/wallet.service';

describe('Wallet Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(WalletService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all wallets ', async () => {
        const getEntities: WalletDTO[] = (
            await request(app.getHttpServer())
                .get('/api/wallets')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET wallets by id', async () => {
        const getEntity: WalletDTO = (
            await request(app.getHttpServer())
                .get('/api/wallets/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create wallets', async () => {
        const createdEntity: WalletDTO = (
            await request(app.getHttpServer())
                .post('/api/wallets')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update wallets', async () => {
        const updatedEntity: WalletDTO = (
            await request(app.getHttpServer())
                .put('/api/wallets')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update wallets from id', async () => {
        const updatedEntity: WalletDTO = (
            await request(app.getHttpServer())
                .put('/api/wallets/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE wallets', async () => {
        const deletedEntity: WalletDTO = (
            await request(app.getHttpServer())
                .delete('/api/wallets/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
