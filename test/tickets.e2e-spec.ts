import { type EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';

import {
  buildDoubleDeckerBusLayoutGrid,
  buildStandardBusLayoutGrid,
} from '../src/domain/entities/bus-layout-grid';
import {
  type CreateTicketParams,
  TICKET_BOOKED_STATUS,
  TICKET_CANCELLED_STATUS,
  TICKET_HELD_STATUS,
  TICKET_STATUSES,
  Ticket,
  type TicketStatus,
} from '../src/domain/entities/ticket.entity';
import { BusEntitySchema } from '../src/infrastructure/database/postgres/entities/bus.entity';
import { BusLayoutEntitySchema } from '../src/infrastructure/database/postgres/entities/bus-layout.entity';
import {
  EnterpriseEntity,
  EnterpriseEntitySchema,
} from '../src/infrastructure/database/postgres/entities/enterprise.entity';
import {
  RouteEntity,
  RouteEntitySchema,
} from '../src/infrastructure/database/postgres/entities/route.entity';
import {
  TicketEntity,
  TicketEntitySchema,
} from '../src/infrastructure/database/postgres/entities/ticket.entity';
import {
  TripEntity,
  TripEntitySchema,
} from '../src/infrastructure/database/postgres/entities/trip.entity';
import {
  UserEntity,
  UserEntitySchema,
} from '../src/infrastructure/database/postgres/entities/user.entity';
import { BusFactory } from '../src/infrastructure/database/postgres/factories/bus.factory';
import { BusLayoutFactory } from '../src/infrastructure/database/postgres/factories/bus-layout.factory';
import { EnterpriseFactory } from '../src/infrastructure/database/postgres/factories/enterprise.factory';
import { RouteFactory } from '../src/infrastructure/database/postgres/factories/route.factory';
import { TicketFactory } from '../src/infrastructure/database/postgres/factories/ticket.factory';
import { TripFactory } from '../src/infrastructure/database/postgres/factories/trip.factory';
import { UserFactory } from '../src/infrastructure/database/postgres/factories/user.factory';
import { TicketsModule } from '../src/tickets.module';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

/**
 * The seat state of a trip is a database rule: a partial unique index on
 * (trip_id, seat_id) over every row whose status is not `cancelled`, plus a
 * check constraint on the status vocabulary.
 *
 * No ticket write path exists yet, so rows are built through the domain entity
 * and mapped to the table exactly as the future repository will (see
 * `toEntity` / `toDomain`). When the booking endpoints land, the seat
 * constraint cases below keep their assertions but drive them over HTTP, and
 * the mapping helpers disappear with the repository that replaces them.
 */
describe('Tickets seat state (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let trip: TripEntity;
  let secondTrip: TripEntity;
  let passenger: UserEntity;
  let secondPassenger: UserEntity;

  const holdUntil = new Date('2026-08-10T09:00:00.000Z');
  const expiredHold = new Date('2026-08-09T09:00:00.000Z');

  /** Fixture data only: the domain still owns which status may carry a hold. */
  interface TicketSpec {
    seatId?: string;
    status?: typeof TICKET_HELD_STATUS | typeof TICKET_BOOKED_STATUS;
    heldUntil?: Date | null;
    trip?: TripEntity;
    user?: UserEntity;
  }

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(TicketsModule, [
      TicketEntitySchema,
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
      email: 'jane@tickets.test',
      role: 'admin',
    });

    const enterprise = await new EnterpriseFactory(orm.em).createOne({
      name: 'Tickets Bus Co.',
      legalId: 'TICKETS-12-3456789',
      owner: owner.id,
    });

    const layout = await new BusLayoutFactory(orm.em).createOne({
      layoutGrid: buildStandardBusLayoutGrid(),
    });

    const bus = await new BusFactory(orm.em).createOne({
      model: 'Mercedes-Benz O500',
      enterprise: enterprise.id,
      layout,
    });

    const route = await new RouteFactory(orm.em).createOne({
      name: 'Central - North',
      origin: 'Terminal Central',
      destination: 'Terminal Norte',
    });

    trip = await new TripFactory(orm.em).createOne({
      departureAt: new Date('2026-08-10T08:00:00.000Z'),
      route: route.id,
      bus,
    });

    secondTrip = await new TripFactory(orm.em).createOne({
      departureAt: new Date('2026-08-10T14:00:00.000Z'),
      route: route.id,
      bus,
    });

    passenger = await new UserFactory(orm.em).createOne({
      name: 'John Passenger',
      email: 'john@tickets.test',
      role: 'user',
    });

    secondPassenger = await new UserFactory(orm.em).createOne({
      name: 'Ana Passenger',
      email: 'ana@tickets.test',
      role: 'user',
    });
  });

  function toEntity(ticket: Ticket, em: EntityManager): TicketEntity {
    return em.create(TicketEntity, {
      id: ticket.id,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      trip: em.getReference(TripEntity, ticket.tripId),
      seatId: ticket.seatId,
      user: em.getReference(UserEntity, ticket.userId),
      status: ticket.status,
      heldUntil: ticket.heldUntil,
    });
  }

  function toDomain(entity: TicketEntity): Ticket {
    return Ticket.reconstruct({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tripId: entity.trip.id,
      seatId: entity.seatId,
      userId: entity.user.id,
      status: entity.status,
      heldUntil: entity.heldUntil,
    });
  }

  function ticketParams(spec: TicketSpec): CreateTicketParams {
    const status = spec.status ?? TICKET_HELD_STATUS;
    const defaultHeldUntil = status === TICKET_HELD_STATUS ? holdUntil : null;

    return {
      tripId: (spec.trip ?? trip).id,
      seatId: spec.seatId ?? '1A',
      userId: (spec.user ?? passenger).id,
      status,
      heldUntil: spec.heldUntil === undefined ? defaultHeldUntil : spec.heldUntil,
    };
  }

  async function persistTicket(spec: TicketSpec = {}): Promise<TicketEntity> {
    const em = orm.em.fork();
    const entity = toEntity(Ticket.create(ticketParams(spec)), em);

    await em.persist(entity).flush();
    em.clear();

    return entity;
  }

  async function transitionTicket(id: string, change: (ticket: Ticket) => void): Promise<void> {
    const em = orm.em.fork();
    const entity = await em.findOneOrFail(TicketEntity, id);
    const ticket = toDomain(entity);

    change(ticket);

    entity.status = ticket.status;
    entity.heldUntil = ticket.heldUntil;
    await em.flush();
    em.clear();
  }

  async function cancelTicket(ticket: TicketEntity): Promise<void> {
    await transitionTicket(ticket.id, (domain) => domain.cancel());
  }

  async function expectSeatTaken(spec: TicketSpec = {}): Promise<void> {
    await expect(persistTicket(spec)).rejects.toThrow(/unique|constraint/i);
  }

  describe('row mapping', () => {
    it('stores a held ticket with its hold expiration', async () => {
      const ticket = await new TicketFactory(orm.em.fork()).createOne({
        trip: orm.em.getReference(TripEntity, trip.id),
        user: orm.em.getReference(UserEntity, passenger.id),
        seatId: '1A',
        status: TICKET_HELD_STATUS,
        heldUntil: holdUntil,
      });

      const persisted = await orm.em.fork().findOneOrFail(TicketEntity, ticket.id);

      expect(persisted.id).toEqual(expect.any(String));
      expect(persisted.trip.id).toBe(trip.id);
      expect(persisted.user.id).toBe(passenger.id);
      expect(persisted.seatId).toBe('1A');
      expect(persisted.status).toBe(TICKET_HELD_STATUS);
      expect(persisted.heldUntil).toEqual(holdUntil);
    });

    it('stores a booked ticket without a hold expiration', async () => {
      const ticket = await new TicketFactory(orm.em.fork()).createOne({
        trip: orm.em.getReference(TripEntity, trip.id),
        user: orm.em.getReference(UserEntity, passenger.id),
        seatId: '1B',
        status: TICKET_BOOKED_STATUS,
        heldUntil: null,
      });

      const persisted = await orm.em.fork().findOneOrFail(TicketEntity, ticket.id);

      expect(persisted.status).toBe(TICKET_BOOKED_STATUS);
      expect(persisted.heldUntil).toBeNull();
    });
  });

  describe('status vocabulary', () => {
    it('accepts every status the domain declares', async () => {
      const em = orm.em.fork();

      TICKET_STATUSES.forEach((status, index) => {
        em.persist(
          em.create(TicketEntity, {
            id: uuidv7(),
            createdAt: new Date(),
            updatedAt: new Date(),
            trip: em.getReference(TripEntity, trip.id),
            seatId: `2${String.fromCharCode(65 + index)}`,
            user: em.getReference(UserEntity, passenger.id),
            status,
            heldUntil: status === TICKET_HELD_STATUS ? holdUntil : null,
          }),
        );
      });

      await expect(em.flush()).resolves.toBeUndefined();
      await expect(orm.em.count(TicketEntity, { trip: trip.id })).resolves.toBe(
        TICKET_STATUSES.length,
      );
    });

    it('rejects a status outside the vocabulary before it reaches the database', async () => {
      const em = orm.em.fork();
      const entity = toEntity(Ticket.create(ticketParams({ seatId: '1A' })), em);
      entity.status = 'reserved' as unknown as TicketStatus;

      await expect(em.persist(entity).flush()).rejects.toThrow(/reserved/);
      em.clear();
    });

    it('rejects a status outside the vocabulary at the database', async () => {
      const connection = orm.em.getConnection();

      await expect(
        connection.execute(
          'insert into tickets (id, created_at, updated_at, trip_id, seat_id, user_id, status, held_until) values (?, ?, ?, ?, ?, ?, ?, ?)',
          [uuidv7(), new Date(), new Date(), trip.id, '1A', passenger.id, 'reserved', null],
        ),
      ).rejects.toThrow(/check|constraint/i);
    });
  });

  describe('active seat constraint', () => {
    it('rejects a second held ticket on the same seat of the same trip', async () => {
      await persistTicket({ seatId: '1A' });

      await expectSeatTaken({ seatId: '1A' });

      await expect(orm.em.count(TicketEntity, { trip: trip.id })).resolves.toBe(1);
    });

    it('rejects a booked ticket on a seat that is already held', async () => {
      await persistTicket({ seatId: '1A' });

      await expectSeatTaken({ seatId: '1A', status: TICKET_BOOKED_STATUS, heldUntil: null });
    });

    it('rejects a held ticket on a seat that is already booked', async () => {
      await persistTicket({ seatId: '1A', status: TICKET_BOOKED_STATUS, heldUntil: null });

      await expectSeatTaken({ seatId: '1A' });
    });

    it('keeps blocking a seat whose hold already expired', async () => {
      await persistTicket({ seatId: '1A', heldUntil: expiredHold });

      await expectSeatTaken({ seatId: '1A' });
    });

    it('frees the seat once the domain cancels the ticket', async () => {
      const ticket = await persistTicket({ seatId: '1A' });

      await cancelTicket(ticket);

      const replacement = await persistTicket({ seatId: '1A', user: secondPassenger });

      expect(replacement.id).not.toBe(ticket.id);
      await expect(orm.em.count(TicketEntity, { trip: trip.id })).resolves.toBe(2);
    });

    it('allows the same seat id on a different trip', async () => {
      await persistTicket({ seatId: '1A' });

      await persistTicket({ seatId: '1A', trip: secondTrip });

      await expect(orm.em.count(TicketEntity, {})).resolves.toBe(2);
    });

    it('allows different seats of the same trip for different passengers', async () => {
      await persistTicket({ seatId: '1A' });
      await persistTicket({ seatId: '1B', user: secondPassenger });
      await persistTicket({ seatId: '2A', user: secondPassenger });

      await expect(orm.em.count(TicketEntity, { trip: trip.id })).resolves.toBe(3);
    });

    it('keeps two cancelled tickets on the same seat as history', async () => {
      const first = await persistTicket({ seatId: '1A' });
      await cancelTicket(first);
      const second = await persistTicket({ seatId: '1A', user: secondPassenger });
      await cancelTicket(second);

      const replacement = await persistTicket({
        seatId: '1A',
        status: TICKET_BOOKED_STATUS,
        heldUntil: null,
      });

      expect(replacement.id).not.toBe(first.id);
      await expect(orm.em.count(TicketEntity, { trip: trip.id })).resolves.toBe(3);
    });

    it('rejects resurrecting a cancelled ticket while another active ticket holds the seat', async () => {
      const cancelled = await persistTicket({ seatId: '1A' });
      await cancelTicket(cancelled);
      await persistTicket({
        seatId: '1A',
        status: TICKET_BOOKED_STATUS,
        heldUntil: null,
        user: secondPassenger,
      });

      const em = orm.em.fork();
      const managed = await em.findOneOrFail(TicketEntity, cancelled.id);
      managed.status = TICKET_BOOKED_STATUS;
      await expect(em.flush()).rejects.toThrow(/unique|constraint/i);
      em.clear();

      const stillCancelled = await orm.em.fork().findOneOrFail(TicketEntity, cancelled.id);
      expect(stillCancelled.status).toBe(TICKET_CANCELLED_STATUS);
    });
  });

  describe('double-decker seats', () => {
    async function createDoubleDeckerTrip(): Promise<TripEntity> {
      const enterprise = await orm.em.findOneOrFail(EnterpriseEntity, { name: 'Tickets Bus Co.' });
      const route = await orm.em.findOneOrFail(RouteEntity, { name: 'Central - North' });
      const layout = await new BusLayoutFactory(orm.em).createOne({
        layoutGrid: buildDoubleDeckerBusLayoutGrid(),
      });
      const bus = await new BusFactory(orm.em).createOne({
        model: 'Double-decker',
        enterprise: enterprise.id,
        layout,
      });

      return new TripFactory(orm.em).createOne({
        departureAt: new Date('2026-08-11T08:00:00.000Z'),
        route: route.id,
        bus,
      });
    }

    it('treats lower and upper deck seats as different seats of the same trip', async () => {
      const deckTrip = await createDoubleDeckerTrip();

      await persistTicket({ seatId: 'L1A', trip: deckTrip });
      await persistTicket({ seatId: 'U1A', trip: deckTrip, user: secondPassenger });

      await expect(orm.em.count(TicketEntity, { trip: deckTrip.id })).resolves.toBe(2);
    });

    it('still rejects the same deck seat twice on a double-decker trip', async () => {
      const deckTrip = await createDoubleDeckerTrip();

      await persistTicket({ seatId: 'U1A', trip: deckTrip });

      await expectSeatTaken({ seatId: 'U1A', trip: deckTrip });
    });
  });
});
