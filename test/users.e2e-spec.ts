import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserEntitySchema } from '../src/infrastructure/database/postgres/entities/user.entity';
import { UserFactory } from '../src/infrastructure/database/postgres/factories/user.factory';
import { UsersModule } from '../src/users.module';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let userId: string;

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(UsersModule, [UserEntitySchema]));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await truncateAll(orm);

    const user = await new UserFactory(orm.em).createOne({
      name: 'Jane Driver',
      email: 'jane@acme.com',
      role: 'driver',
    });
    userId = user.id;
  });

  describe('/users (POST)', () => {
    it('creates a user correctly', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Bob Admin',
          email: 'bob@acme.com',
          role: 'admin',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('Bob Admin');
          expect(response.body.email).toBe('bob@acme.com');
          expect(response.body.role).toBe('admin');
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer()).post('/users').send({ name: 'No Email' }).expect(400);
    });

    it('returns 400 on duplicate email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Clone',
          email: 'jane@acme.com',
          role: 'user',
        })
        .expect(400);
    });

    it('returns 400 on invalid role', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Bad Role',
          email: 'badrole@acme.com',
          role: 'superadmin',
        })
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('lists users with pagination metadata', () => {
      return request(app.getHttpServer())
        .get('/users?limit=10&offset=0')
        .expect(200)
        .then((response) => {
          expect(response.body.users).toHaveLength(1);
          expect(response.body.users[0].name).toBe('Jane Driver');
          expect(response.body.total).toBe(1);
          expect(response.body.limit).toBe(10);
          expect(response.body.offset).toBe(0);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('gets a user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(userId);
          expect(response.body.name).toBe('Jane Driver');
        });
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('updates name', () => {
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ name: 'Jane Lead Driver' })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Jane Lead Driver');
          expect(response.body.email).toBe('jane@acme.com');
        });
    });

    it('updates role', () => {
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ role: 'admin' })
        .expect(200)
        .then((response) => {
          expect(response.body.role).toBe('admin');
        });
    });

    it('updates email', () => {
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ email: 'new@acme.com' })
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBe('new@acme.com');
        });
    });

    it('returns 404 when user not found', () => {
      return request(app.getHttpServer())
        .put('/users/00000000-0000-0000-0000-000000000000')
        .send({ name: 'X' })
        .expect(404);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('deletes a user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(204)
        .then(() => request(app.getHttpServer()).get(`/users/${userId}`).expect(404));
    });

    it('returns 404 when not found', () => {
      return request(app.getHttpServer())
        .delete('/users/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('Complete workflow', () => {
    it('create → get → update → delete', async () => {
      const created = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Workflow User',
          email: 'wf@acme.com',
          role: 'user',
        })
        .expect(201);

      const id = created.body.id;

      await request(app.getHttpServer()).get(`/users/${id}`).expect(200);

      await request(app.getHttpServer()).put(`/users/${id}`).send({ role: 'admin' }).expect(200);

      await request(app.getHttpServer()).delete(`/users/${id}`).expect(204);

      await request(app.getHttpServer()).get(`/users/${id}`).expect(404);
    });
  });
});
