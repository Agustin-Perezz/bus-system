import { Trip } from './trip.entity';

describe('Trip Entity', () => {
  const fixedDate = new Date('2026-08-10T08:00:00.000Z');
  const routeId = '0193b1a0-0000-7bbb-8bbb-000000000001';

  describe('create', () => {
    it('creates a trip with departureAt, routeId and base entity props', () => {
      const trip = Trip.create({ departureAt: fixedDate, routeId });

      expect(trip.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(trip.departureAt).toBe(fixedDate);
      expect(trip.routeId).toBe(routeId);
      expect(trip.createdAt).toBeInstanceOf(Date);
      expect(trip.updatedAt).toBeInstanceOf(Date);
      expect(trip.createdAt.getTime()).toBe(trip.updatedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000000';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');

      const trip = Trip.reconstruct({
        id,
        departureAt: fixedDate,
        routeId,
        createdAt,
        updatedAt,
      });

      expect(trip.id).toBe(id);
      expect(trip.createdAt).toBe(createdAt);
      expect(trip.updatedAt).toBe(updatedAt);
      expect(trip.departureAt).toBe(fixedDate);
      expect(trip.routeId).toBe(routeId);
    });
  });

  describe('updateDepartureAt', () => {
    it('mutates departureAt and advances updatedAt', async () => {
      const trip = Trip.create({ departureAt: fixedDate, routeId });
      const originalUpdatedAt = trip.updatedAt;
      const newDate = new Date('2026-08-11T09:00:00.000Z');

      await new Promise((r) => setTimeout(r, 5));
      trip.updateDepartureAt(newDate);

      expect(trip.departureAt).toBe(newDate);
      expect(trip.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateRouteId', () => {
    it('mutates routeId and advances updatedAt', async () => {
      const trip = Trip.create({ departureAt: fixedDate, routeId });
      const originalUpdatedAt = trip.updatedAt;
      const newRouteId = '0193b1a0-0000-7bbb-8bbb-000000000099';

      await new Promise((r) => setTimeout(r, 5));
      trip.updateRouteId(newRouteId);

      expect(trip.routeId).toBe(newRouteId);
      expect(trip.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
