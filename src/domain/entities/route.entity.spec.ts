import { Route } from './route.entity';

describe('Route Entity', () => {
  describe('create', () => {
    it('creates a route with name, origin, destination and base entity props', () => {
      const route = Route.create({
        name: 'Central - North',
        origin: 'Terminal Central',
        destination: 'Terminal Norte',
      });

      expect(route.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(route.name).toBe('Central - North');
      expect(route.origin).toBe('Terminal Central');
      expect(route.destination).toBe('Terminal Norte');
      expect(route.createdAt).toBeInstanceOf(Date);
      expect(route.updatedAt).toBeInstanceOf(Date);
      expect(route.createdAt.getTime()).toBe(route.updatedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000000';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');

      const route = Route.reconstruct({
        id,
        name: 'South Line',
        origin: 'Plaza Mayor',
        destination: 'Estacion Sur',
        createdAt,
        updatedAt,
      });

      expect(route.id).toBe(id);
      expect(route.createdAt).toBe(createdAt);
      expect(route.updatedAt).toBe(updatedAt);
      expect(route.name).toBe('South Line');
      expect(route.origin).toBe('Plaza Mayor');
      expect(route.destination).toBe('Estacion Sur');
    });
  });

  describe('updateName', () => {
    it('mutates name and advances updatedAt', async () => {
      const route = Route.create({
        name: 'Old',
        origin: 'A',
        destination: 'B',
      });
      const originalUpdatedAt = route.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      route.updateName('New');

      expect(route.name).toBe('New');
      expect(route.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateOrigin', () => {
    it('mutates origin and advances updatedAt', async () => {
      const route = Route.create({ name: 'R', origin: 'A', destination: 'B' });
      const originalUpdatedAt = route.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      route.updateOrigin('C');

      expect(route.origin).toBe('C');
      expect(route.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateDestination', () => {
    it('mutates destination and advances updatedAt', async () => {
      const route = Route.create({ name: 'R', origin: 'A', destination: 'B' });
      const originalUpdatedAt = route.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      route.updateDestination('D');

      expect(route.destination).toBe('D');
      expect(route.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
