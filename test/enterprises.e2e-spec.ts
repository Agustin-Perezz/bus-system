import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { EnterprisesModule } from '../src/enterprises.module';
import { EnterpriseEntitySchema } from '../src/infrastructure/database/postgres/entities/enterprise.entity';
import { UserEntitySchema } from '../src/infrastructure/database/postgres/entities/user.entity';
import { EnterpriseFactory } from '../src/infrastructure/database/postgres/factories/enterprise.factory';
import { UserFactory } from '../src/infrastructure/database/postgres/factories/user.factory';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Enterprises Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let enterpriseId: string;
  let ownerId: string;

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(EnterprisesModule, [
      EnterpriseEntitySchema,
      UserEntitySchema,
    ]));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await truncateAll(orm);

    const owner = await new UserFactory(orm.em).createOne({
      name: 'Jane Owner',
      email: 'jane@acme.com',
      role: 'admin',
    });
    ownerId = owner.id;

    const enterprise = await new EnterpriseFactory(orm.em).createOne({
      name: 'Acme Bus Co.',
      legalId: 'US-12-3456789',
      owner: ownerId,
    });
    enterpriseId = enterprise.id;
  });

  describe('/enterprises (POST)', () => {
    it('creates an enterprise correctly', async () => {
      const secondOwner = await new UserFactory(orm.em).createOne({
        name: 'Second Owner',
        email: 'second@acme.com',
        role: 'admin',
      });

      return request(app.getHttpServer())
        .post('/enterprises')
        .send({ name: 'RoadRunner Lines', legalId: 'AR-30-12345678', ownerId: secondOwner.id })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('RoadRunner Lines');
          expect(response.body.legalId).toBe('AR-30-12345678');
          expect(response.body.ownerId).toBe(secondOwner.id);
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/enterprises')
        .send({ name: 'No Legal' })
        .expect(400);
    });

    it('returns 400 on duplicate legalId', async () => {
      const secondOwner = await new UserFactory(orm.em).createOne({
        name: 'Dup Owner',
        email: 'dup@acme.com',
        role: 'admin',
      });

      return request(app.getHttpServer())
        .post('/enterprises')
        .send({ name: 'Clone', legalId: 'US-12-3456789', ownerId: secondOwner.id })
        .expect(400);
    });

    it('returns 404 when owner does not exist', () => {
      return request(app.getHttpServer())
        .post('/enterprises')
        .send({ name: 'Orphan', legalId: 'XX-1', ownerId: '00000000-0000-0000-0000-000000000000' })
        .expect(404);
    });
  });

  describe('/enterprises (GET)', () => {
    it('lists enterprises with pagination metadata', () => {
      return request(app.getHttpServer())
        .get('/enterprises?limit=10&offset=0')
        .expect(200)
        .then((response) => {
          expect(response.body.enterprises).toHaveLength(1);
          expect(response.body.enterprises[0].name).toBe('Acme Bus Co.');
          expect(response.body.total).toBe(1);
          expect(response.body.limit).toBe(10);
          expect(response.body.offset).toBe(0);
        });
    });

    it('respects limit', () => {
      return request(app.getHttpServer())
        .get('/enterprises?limit=1&offset=0')
        .expect(200)
        .then((response) => {
          expect(response.body.enterprises).toHaveLength(1);
          expect(response.body.limit).toBe(1);
        });
    });
  });

  describe('/enterprises/:id (GET)', () => {
    it('gets an enterprise by id', () => {
      return request(app.getHttpServer())
        .get(`/enterprises/${enterpriseId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(enterpriseId);
          expect(response.body.name).toBe('Acme Bus Co.');
          expect(response.body.ownerId).toBe(ownerId);
        });
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .get('/enterprises/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/enterprises/:id (PUT)', () => {
    it('updates name', () => {
      return request(app.getHttpServer())
        .put(`/enterprises/${enterpriseId}`)
        .send({ name: 'Acme Bus Inc.' })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Acme Bus Inc.');
          expect(response.body.legalId).toBe('US-12-3456789');
        });
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .put('/enterprises/00000000-0000-0000-0000-000000000000')
        .send({ name: 'X' })
        .expect(404);
    });

    it('returns 404 when owner not found on update', () => {
      return request(app.getHttpServer())
        .put(`/enterprises/${enterpriseId}`)
        .send({ ownerId: '00000000-0000-0000-0000-000000000000' })
        .expect(404);
    });
  });

  describe('/enterprises/:id (DELETE)', () => {
    it('deletes an enterprise', () => {
      return request(app.getHttpServer())
        .delete(`/enterprises/${enterpriseId}`)
        .expect(204)
        .then(() => request(app.getHttpServer()).get(`/enterprises/${enterpriseId}`).expect(404));
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .delete('/enterprises/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('Complete workflow', () => {
    it('create → get → update → delete', async () => {
      const wfOwner = await new UserFactory(orm.em).createOne({
        name: 'WF Owner',
        email: 'wf-owner@acme.com',
        role: 'admin',
      });

      const created = await request(app.getHttpServer())
        .post('/enterprises')
        .send({ name: 'Workflow Co.', legalId: 'WF-1', ownerId: wfOwner.id })
        .expect(201);

      const id = created.body.id;

      await request(app.getHttpServer()).get(`/enterprises/${id}`).expect(200);

      await request(app.getHttpServer())
        .put(`/enterprises/${id}`)
        .send({ name: 'Workflow Inc.' })
        .expect(200);

      await request(app.getHttpServer()).delete(`/enterprises/${id}`).expect(204);

      await request(app.getHttpServer()).get(`/enterprises/${id}`).expect(404);
    });
  });
});
