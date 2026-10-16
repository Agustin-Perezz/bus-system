import {
  TICKET_BOOKED_WITH_HOLD_UNTIL_ERROR,
  TICKET_CANCEL_CANCELLED_ERROR,
  TICKET_CONFIRM_NOT_HELD_ERROR,
  TICKET_HELD_WITHOUT_HOLD_UNTIL_ERROR,
  TICKET_STATUSES,
  Ticket,
} from './ticket.entity';

describe('Ticket', () => {
  const tripId = '01a13f79-ee98-7615-b448-dc2b2165d232';
  const userId = '01a13f95-7032-766c-990b-98ffc64a2744';
  const seatId = '1A';
  const heldUntil = new Date('2026-08-10T09:00:00.000Z');

  function createHeldTicket(): Ticket {
    return Ticket.create({ tripId, seatId, userId, status: 'held', heldUntil });
  }

  function createBookedTicket(): Ticket {
    return Ticket.create({ tripId, seatId, userId, status: 'booked' });
  }

  it('pins the status vocabulary the seat constraint depends on', () => {
    expect(TICKET_STATUSES).toEqual(['held', 'booked', 'cancelled']);
  });

  describe('create', () => {
    it('creates a held ticket with identity and state fields', () => {
      const ticket = createHeldTicket();

      expect(ticket.id).toEqual(expect.any(String));
      expect(ticket.createdAt).toEqual(expect.any(Date));
      expect(ticket.updatedAt).toEqual(expect.any(Date));
      expect(ticket.tripId).toBe(tripId);
      expect(ticket.seatId).toBe(seatId);
      expect(ticket.userId).toBe(userId);
      expect(ticket.status).toBe('held');
      expect(ticket.heldUntil).toEqual(heldUntil);
      expect(ticket.isActive()).toBe(true);
    });

    it('creates a booked ticket without a hold expiration', () => {
      const ticket = createBookedTicket();

      expect(ticket.status).toBe('booked');
      expect(ticket.heldUntil).toBeNull();
      expect(ticket.isActive()).toBe(true);
    });

    it('rejects a held ticket without a hold expiration', () => {
      expect(() =>
        Ticket.create({ tripId, seatId, userId, status: 'held', heldUntil: null }),
      ).toThrow(TICKET_HELD_WITHOUT_HOLD_UNTIL_ERROR);
    });

    it('rejects a booked ticket that carries a hold expiration', () => {
      expect(() => Ticket.create({ tripId, seatId, userId, status: 'booked', heldUntil })).toThrow(
        TICKET_BOOKED_WITH_HOLD_UNTIL_ERROR,
      );
    });

    it('rejects a held ticket with no hold instant at all', () => {
      expect(() => Ticket.create({ tripId, seatId, userId, status: 'held' })).toThrow(
        TICKET_HELD_WITHOUT_HOLD_UNTIL_ERROR,
      );
    });
  });

  describe('confirm', () => {
    it('turns a held ticket into a booked ticket and clears the hold', () => {
      const ticket = createHeldTicket();

      ticket.confirm();

      expect(ticket.status).toBe('booked');
      expect(ticket.heldUntil).toBeNull();
      expect(ticket.isActive()).toBe(true);
    });

    it('rejects confirming a ticket that is already booked', () => {
      const ticket = createBookedTicket();

      expect(() => ticket.confirm()).toThrow(TICKET_CONFIRM_NOT_HELD_ERROR);
    });

    it('rejects confirming a cancelled ticket', () => {
      const ticket = createHeldTicket();
      ticket.cancel();

      expect(() => ticket.confirm()).toThrow(TICKET_CONFIRM_NOT_HELD_ERROR);
    });
  });

  describe('cancel', () => {
    it('cancels a held ticket and releases the hold', () => {
      const ticket = createHeldTicket();

      ticket.cancel();

      expect(ticket.status).toBe('cancelled');
      expect(ticket.heldUntil).toBeNull();
      expect(ticket.isActive()).toBe(false);
    });

    it('cancels a booked ticket and releases the seat', () => {
      const ticket = createBookedTicket();

      ticket.cancel();

      expect(ticket.status).toBe('cancelled');
      expect(ticket.heldUntil).toBeNull();
      expect(ticket.isActive()).toBe(false);
    });

    it('rejects cancelling a ticket twice', () => {
      const ticket = createHeldTicket();
      ticket.cancel();

      expect(() => ticket.cancel()).toThrow(TICKET_CANCEL_CANCELLED_ERROR);
    });
  });

  describe('hasExpiredHold', () => {
    it('reports an expired hold for a held ticket past its expiration', () => {
      const ticket = createHeldTicket();

      expect(ticket.hasExpiredHold(new Date(heldUntil.getTime() + 1))).toBe(true);
    });

    it('reports a live hold for a held ticket before its expiration', () => {
      const ticket = createHeldTicket();

      expect(ticket.hasExpiredHold(new Date(heldUntil.getTime() - 1))).toBe(false);
    });

    it('reports an expired hold at exactly the hold instant', () => {
      const ticket = createHeldTicket();

      expect(ticket.hasExpiredHold(new Date(heldUntil.getTime()))).toBe(true);
    });

    it('never reports an expired hold for a booked ticket', () => {
      const ticket = createBookedTicket();

      expect(ticket.hasExpiredHold(new Date('2030-01-01T00:00:00.000Z'))).toBe(false);
    });
  });

  describe('touch', () => {
    it('advances updatedAt on every state transition', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
      const ticket = createHeldTicket();

      jest.setSystemTime(new Date('2026-01-01T00:05:00.000Z'));
      ticket.confirm();

      expect(ticket.updatedAt.getTime()).toBe(ticket.createdAt.getTime() + 300_000);
      jest.useRealTimers();
    });
  });

  describe('reconstruct', () => {
    it('restores a cancelled ticket without revalidating transitions', () => {
      const id = '01a13f00-0000-7000-8000-000000000001';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');
      const updatedAt = new Date('2026-01-02T00:00:00.000Z');

      const ticket = Ticket.reconstruct({
        id,
        createdAt,
        updatedAt,
        tripId,
        seatId: 'U1A',
        userId,
        status: 'cancelled',
        heldUntil: null,
      });

      expect(ticket.id).toBe(id);
      expect(ticket.seatId).toBe('U1A');
      expect(ticket.status).toBe('cancelled');
      expect(ticket.heldUntil).toBeNull();
      expect(ticket.isActive()).toBe(false);
    });
  });
});
