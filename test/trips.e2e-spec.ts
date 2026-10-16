import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { buildStandardBusLayoutGrid } from '../src/domain/entities/bus-layout-grid';
import { BusEntitySchema } from '../src/infrastructure/database/postgres/entities/bus.entity';
import { BusLayoutEntitySchema } from '../src/infrastructure/database/postgres/entities/bus-layout.entity';
import { EnterpriseEntitySchema } from '../src/infrastructure/database/postgres/entities/enterprise.entity';
import { RouteEntitySchema } from '../src/infrastructure/database/postgres/entities/route.entity';
import { TripEntitySchema } from '../src/infrastructure/database/postgres/entities/trip.entity';
import { UserEntitySchema } from '../src/infrastructure/database/postgres/entities/user.entity';
import { BusFactory } from '../src/infrastructure/database/postgres/factories/bus.factory';
import { BusLayoutFactory } from '../src/infrastructure/database/postgres/factories/bus-layout.factory';
import { EnterpriseFactory } from '../src/infrastructure/database/postgres/factories/enterprise.factory';
import { RouteFactory } from '../src/infrastructure/database/postgres/factories/route.factory';
import { TripFactory } from '../src/infrastructure/database/postgres/factories/trip.factory';
import { UserFactory } from '../src/infrastructure/database/postgres/factories/user.factory';
import { TripsModule } from '../src/trips.module';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Trips Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let tripId: string;
  let routeId: string;
  let busId: string;
  let layoutId: string;
  const departureAt = '2026-08-10T08:00:00.000Z';

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(TripsModule, [
      TripEntitySchema,
      RouteEntitySchema,
      BusEntitySchema,
      BusLayoutEntitySchema,
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
      email: 'jane@trips.test',
      role: 'admin',
    });

    const enterprise = await new EnterpriseFactory(orm.em).createOne({
      name: 'Trips Bus Co.',
      legalId: 'TRIPS-12-3456789',
      owner: owner.id,
    });

    const layout = await new BusLayoutFactory(orm.em).createOne();
    layoutId = layout.id;

    const bus = await new BusFactory(orm.em).createOne({
      model: 'Mercedes-Benz O500',
      enterprise: enterprise.id,
      layout,
    });
    busId = bus.id;

    const route = await new RouteFactory(orm.em).createOne({
      name: 'Central - North',
      origin: 'Terminal Central',
      destination: 'Terminal Norte',
    });
    routeId = route.id;

    const trip = await new TripFactory(orm.em).createOne({
      departureAt: new Date(departureAt),
      route: routeId,
      bus,
    });
    tripId = trip.id;
  });

  describe('/trips (POST)', () => {
    it('creates a trip correctly', () => {
      return request(app.getHttpServer())
        .post('/trips')
        .send({ departureAt, routeId, busId })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.departureAt).toBe(departureAt);
          expect(response.body.routeId).toBe(routeId);
          expect(response.body.busId).toBe(busId);
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer()).post('/trips').send({ departureAt, routeId }).expect(400);
    });

    it('returns 400 on invalid date format', () => {
      return request(app.getHttpServer())
        .post('/trips')
        .send({ departureAt: 'not-a-date', routeId, busId })
        .expect(400);
    });

    it('returns 404 when route does not exist', () => {
      return request(app.getHttpServer())
        .post('/trips')
        .send({
          departureAt,
          routeId: '00000000-0000-0000-0000-000000000000',
          busId,
        })
        .expect(404);
    });

    it('returns 404 when bus does not exist', () => {
      return request(app.getHttpServer())
        .post('/trips')
        .send({
          departureAt,
          routeId,
          busId: '00000000-0000-0000-0000-000000000000',
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
          expect(response.body.trips[0].busId).toBe(busId);
          expect(response.body.total).toBe(1);
          expect(response.body.limit).toBe(10);
          expect(response.body.offset).toBe(0);
        });
    });
  });

  describe('/trips/:id (GET)', () => {
    it('gets a trip by id with its bus and nested layout grid', () => {
      return request(app.getHttpServer())
        .get(`/trips/${tripId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(tripId);
          expect(response.body.routeId).toBe(routeId);
          expect(response.body.busId).toBe(busId);
          expect(response.body.bus.id).toBe(busId);
          expect(response.body.bus.model).toBe('Mercedes-Benz O500');
          expect(response.body.bus.layout.id).toBe(layoutId);
          expect(response.body.bus.layout.layoutGrid).toEqual(buildStandardBusLayoutGrid());
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
          expect(response.body.busId).toBe(busId);
        });
    });

    it('returns 404 when route not found on update', () => {
      return request(app.getHttpServer())
        .put(`/trips/${tripId}`)
        .send({ routeId: '00000000-0000-0000-0000-000000000000' })
        .expect(404);
    });

    it('rejects busId on update instead of silently ignoring it', () => {
      return request(app.getHttpServer())
        .put(`/trips/${tripId}`)
        .send({ busId: '00000000-0000-0000-0000-000000000000' })
        .expect(400)
        .then((response) => {
          expect(response.body.busId).toBeUndefined();
        });
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
        .send({ departureAt, routeId, busId })
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
