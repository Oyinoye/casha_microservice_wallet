import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { JournalLineDTO } from '../src/service/dto/journal-line.dto';
import { JournalLineService } from '../src/service/journal-line.service';

describe('JournalLine Controller', () => {
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
            .overrideProvider(JournalLineService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all journal-lines ', async () => {
        const getEntities: JournalLineDTO[] = (
            await request(app.getHttpServer())
                .get('/api/journal-lines')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET journal-lines by id', async () => {
        const getEntity: JournalLineDTO = (
            await request(app.getHttpServer())
                .get('/api/journal-lines/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create journal-lines', async () => {
        const createdEntity: JournalLineDTO = (
            await request(app.getHttpServer())
                .post('/api/journal-lines')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update journal-lines', async () => {
        const updatedEntity: JournalLineDTO = (
            await request(app.getHttpServer())
                .put('/api/journal-lines')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update journal-lines from id', async () => {
        const updatedEntity: JournalLineDTO = (
            await request(app.getHttpServer())
                .put('/api/journal-lines/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE journal-lines', async () => {
        const deletedEntity: JournalLineDTO = (
            await request(app.getHttpServer())
                .delete('/api/journal-lines/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
