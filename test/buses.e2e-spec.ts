import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BusesModule } from '../src/buses.module';
import { BusEntitySchema } from '../src/infrastructure/database/postgres/entities/bus.entity';
import { EnterpriseEntitySchema } from '../src/infrastructure/database/postgres/entities/enterprise.entity';
import { BusFactory } from '../src/infrastructure/database/postgres/factories/bus.factory';
import { EnterpriseFactory } from '../src/infrastructure/database/postgres/factories/enterprise.factory';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Buses Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let busId: string;
  let enterpriseId: string;

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(BusesModule, [BusEntitySchema, EnterpriseEntitySchema]));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await truncateAll(orm);

    const enterprise = await new EnterpriseFactory(orm.em).createOne({
      name: 'Acme Bus Co.',
      legalId: 'US-12-3456789',
    });
    enterpriseId = enterprise.id;

    const bus = await new BusFactory(orm.em).createOne({
      model: 'Mercedes-Benz O500',
      enterprise: enterpriseId,
    });
    busId = bus.id;
  });

  describe('/buses (POST)', () => {
    it('creates a bus correctly', () => {
      return request(app.getHttpServer())
        .post('/buses')
        .send({ model: 'Volvo 9700', enterpriseId })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.model).toBe('Volvo 9700');
          expect(response.body.enterpriseId).toBe(enterpriseId);
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/buses')
        .send({ model: 'No Enterprise' })
        .expect(400);
    });

    it('returns 404 when enterprise does not exist', () => {
      return request(app.getHttpServer())
        .post('/buses')
        .send({
          model: 'Orphan Bus',
          enterpriseId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);
    });
  });

  describe('/buses (GET)', () => {
    it('lists buses with pagination metadata', () => {
      return request(app.getHttpServer())
        .get('/buses?limit=10&offset=0')
        .expect(200)
        .then((response) => {
          expect(response.body.buses).toHaveLength(1);
          expect(response.body.buses[0].model).toBe('Mercedes-Benz O500');
          expect(response.body.total).toBe(1);
          expect(response.body.limit).toBe(10);
          expect(response.body.offset).toBe(0);
        });
    });
  });

  describe('/buses/:id (GET)', () => {
    it('gets a bus by id', () => {
      return request(app.getHttpServer())
        .get(`/buses/${busId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(busId);
          expect(response.body.model).toBe('Mercedes-Benz O500');
          expect(response.body.enterpriseId).toBe(enterpriseId);
        });
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .get('/buses/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/buses/:id (PUT)', () => {
    it('updates model', () => {
      return request(app.getHttpServer())
        .put(`/buses/${busId}`)
        .send({ model: 'Mercedes-Benz O500R' })
        .expect(200)
        .then((response) => {
          expect(response.body.model).toBe('Mercedes-Benz O500R');
          expect(response.body.enterpriseId).toBe(enterpriseId);
        });
    });

    it('returns 404 when enterprise not found on update', () => {
      return request(app.getHttpServer())
        .put(`/buses/${busId}`)
        .send({ enterpriseId: '00000000-0000-0000-0000-000000000000' })
        .expect(404);
    });

    it('returns 404 when bus not found', () => {
      return request(app.getHttpServer())
        .put('/buses/00000000-0000-0000-0000-000000000000')
        .send({ model: 'X' })
        .expect(404);
    });
  });

  describe('/buses/:id (DELETE)', () => {
    it('deletes a bus', () => {
      return request(app.getHttpServer())
        .delete(`/buses/${busId}`)
        .expect(204)
        .then(() => request(app.getHttpServer()).get(`/buses/${busId}`).expect(404));
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .delete('/buses/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('Complete workflow', () => {
    it('create → get → update → delete', async () => {
      const created = await request(app.getHttpServer())
        .post('/buses')
        .send({ model: 'Workflow Bus', enterpriseId })
        .expect(201);

      const id = created.body.id;

      await request(app.getHttpServer()).get(`/buses/${id}`).expect(200);

      await request(app.getHttpServer())
        .put(`/buses/${id}`)
        .send({ model: 'Workflow Bus Pro' })
        .expect(200);

      await request(app.getHttpServer()).delete(`/buses/${id}`).expect(204);

      await request(app.getHttpServer()).get(`/buses/${id}`).expect(404);
    });
  });
});
