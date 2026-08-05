import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { RouteEntitySchema } from '../src/infrastructure/database/postgres/entities/route.entity';
import { TripEntitySchema } from '../src/infrastructure/database/postgres/entities/trip.entity';
import { RouteFactory } from '../src/infrastructure/database/postgres/factories/route.factory';
import { TripFactory } from '../src/infrastructure/database/postgres/factories/trip.factory';
import { TripsModule } from '../src/trips.module';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Trips Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let tripId: string;
  let routeId: string;
  const departureAt = '2026-08-10T08:00:00.000Z';

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(TripsModule, [TripEntitySchema, RouteEntitySchema]));
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

    const trip = await new TripFactory(orm.em).createOne({
      departureAt: new Date(departureAt),
      route: routeId,
    });
    tripId = trip.id;
  });

  describe('/trips (POST)', () => {
    it('creates a trip correctly', () => {
      return request(app.getHttpServer())
        .post('/trips')
        .send({ departureAt, routeId })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.departureAt).toBe(departureAt);
          expect(response.body.routeId).toBe(routeId);
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer()).post('/trips').send({ departureAt }).expect(400);
    });

    it('returns 400 on invalid date format', () => {
      return request(app.getHttpServer())
        .post('/trips')
        .send({ departureAt: 'not-a-date', routeId })
        .expect(400);
    });

    it('returns 404 when route does not exist', () => {
      return request(app.getHttpServer())
        .post('/trips')
        .send({
          departureAt,
          routeId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);
    });
  });

  describe('/trips (GET)', () => {
    it('lists trips with pagination metadata', () => {
      return request(app.getHttpServer())
        .get('/trips?limit=10&offset=0')
        .expect(200)
        .then((response) => {
          expect(response.body.trips).toHaveLength(1);
          expect(response.body.trips[0].routeId).toBe(routeId);
          expect(response.body.total).toBe(1);
          expect(response.body.limit).toBe(10);
          expect(response.body.offset).toBe(0);
        });
    });
  });

  describe('/trips/:id (GET)', () => {
    it('gets a trip by id', () => {
      return request(app.getHttpServer())
        .get(`/trips/${tripId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(tripId);
          expect(response.body.routeId).toBe(routeId);
        });
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .get('/trips/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/trips/:id (PUT)', () => {
    it('updates departureAt', () => {
      return request(app.getHttpServer())
        .put(`/trips/${tripId}`)
        .send({ departureAt: '2026-08-11T09:00:00.000Z' })
        .expect(200)
        .then((response) => {
          expect(response.body.departureAt).toBe('2026-08-11T09:00:00.000Z');
          expect(response.body.routeId).toBe(routeId);
        });
    });

    it('returns 404 when route not found on update', () => {
      return request(app.getHttpServer())
        .put(`/trips/${tripId}`)
        .send({ routeId: '00000000-0000-0000-0000-000000000000' })
        .expect(404);
    });

    it('returns 404 when trip not found', () => {
      return request(app.getHttpServer())
        .put('/trips/00000000-0000-0000-0000-000000000000')
        .send({ departureAt })
        .expect(404);
    });
  });

  describe('/trips/:id (DELETE)', () => {
    it('deletes a trip', () => {
      return request(app.getHttpServer())
        .delete(`/trips/${tripId}`)
        .expect(204)
        .then(() => request(app.getHttpServer()).get(`/trips/${tripId}`).expect(404));
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .delete('/trips/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('Complete workflow', () => {
    it('create → get → update → delete', async () => {
      const created = await request(app.getHttpServer())
        .post('/trips')
        .send({ departureAt, routeId })
        .expect(201);

      const id = created.body.id;

      await request(app.getHttpServer()).get(`/trips/${id}`).expect(200);

      await request(app.getHttpServer())
        .put(`/trips/${id}`)
        .send({ departureAt: '2026-08-12T10:00:00.000Z' })
        .expect(200);

      await request(app.getHttpServer()).delete(`/trips/${id}`).expect(204);

      await request(app.getHttpServer()).get(`/trips/${id}`).expect(404);
    });
  });
});
