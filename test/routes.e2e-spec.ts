import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { RouteEntitySchema } from '../src/infrastructure/database/postgres/entities/route.entity';
import { RouteFactory } from '../src/infrastructure/database/postgres/factories/route.factory';
import { RoutesModule } from '../src/routes.module';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Routes Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let routeId: string;

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(RoutesModule, [RouteEntitySchema]));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await truncateAll(orm);
    const route = await new RouteFactory(orm.em).createOne({
      name: 'Central - North',
      origin: 'Terminal Central',
      destination: 'Terminal Norte',
    });
    routeId = route.id;
  });

  describe('/routes (POST)', () => {
    it('creates a route correctly', () => {
      return request(app.getHttpServer())
        .post('/routes')
        .send({
          name: 'South Line',
          origin: 'Plaza Mayor',
          destination: 'Estacion Sur',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('South Line');
          expect(response.body.origin).toBe('Plaza Mayor');
          expect(response.body.destination).toBe('Estacion Sur');
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer()).post('/routes').send({ name: 'No Origin' }).expect(400);
    });
  });

  describe('/routes (GET)', () => {
    it('lists routes with pagination metadata', () => {
      return request(app.getHttpServer())
        .get('/routes?limit=10&offset=0')
        .expect(200)
        .then((response) => {
          expect(response.body.routes).toHaveLength(1);
          expect(response.body.routes[0].name).toBe('Central - North');
          expect(response.body.total).toBe(1);
          expect(response.body.limit).toBe(10);
          expect(response.body.offset).toBe(0);
        });
    });

    it('respects limit', () => {
      return request(app.getHttpServer())
        .get('/routes?limit=1&offset=0')
        .expect(200)
        .then((response) => {
          expect(response.body.routes).toHaveLength(1);
          expect(response.body.limit).toBe(1);
        });
    });
  });

  describe('/routes/:id (GET)', () => {
    it('gets a route by id', () => {
      return request(app.getHttpServer())
        .get(`/routes/${routeId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(routeId);
          expect(response.body.name).toBe('Central - North');
        });
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .get('/routes/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/routes/:id (PUT)', () => {
    it('updates name', () => {
      return request(app.getHttpServer())
        .put(`/routes/${routeId}`)
        .send({ name: 'Central - North Express' })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Central - North Express');
          expect(response.body.origin).toBe('Terminal Central');
        });
    });

    it('updates origin and destination', () => {
      return request(app.getHttpServer())
        .put(`/routes/${routeId}`)
        .send({ origin: 'New Origin', destination: 'New Destination' })
        .expect(200)
        .then((response) => {
          expect(response.body.origin).toBe('New Origin');
          expect(response.body.destination).toBe('New Destination');
        });
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .put('/routes/00000000-0000-0000-0000-000000000000')
        .send({ name: 'X' })
        .expect(404);
    });
  });

  describe('/routes/:id (DELETE)', () => {
    it('deletes a route', () => {
      return request(app.getHttpServer())
        .delete(`/routes/${routeId}`)
        .expect(204)
        .then(() => request(app.getHttpServer()).get(`/routes/${routeId}`).expect(404));
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .delete('/routes/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('Complete workflow', () => {
    it('create → get → update → delete', async () => {
      const created = await request(app.getHttpServer())
        .post('/routes')
        .send({
          name: 'Workflow Line',
          origin: 'A',
          destination: 'B',
        })
        .expect(201);

      const id = created.body.id;

      await request(app.getHttpServer()).get(`/routes/${id}`).expect(200);

      await request(app.getHttpServer())
        .put(`/routes/${id}`)
        .send({ name: 'Workflow Express' })
        .expect(200);

      await request(app.getHttpServer()).delete(`/routes/${id}`).expect(204);

      await request(app.getHttpServer()).get(`/routes/${id}`).expect(404);
    });
  });
});
