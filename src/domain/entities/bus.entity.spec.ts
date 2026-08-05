import { Bus } from './bus.entity';

describe('Bus Entity', () => {
  describe('create', () => {
    it('creates a bus with model, enterpriseId and base entity props', () => {
      const bus = Bus.create({
        model: 'Mercedes-Benz O500',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001',
      });

      expect(bus.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(bus.model).toBe('Mercedes-Benz O500');
      expect(bus.enterpriseId).toBe('0193b1a0-0000-7bbb-8bbb-000000000001');
      expect(bus.createdAt).toBeInstanceOf(Date);
      expect(bus.updatedAt).toBeInstanceOf(Date);
      expect(bus.createdAt.getTime()).toBe(bus.updatedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000000';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');

      const bus = Bus.reconstruct({
        id,
        model: 'Volvo 9700',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000002',
        createdAt,
        updatedAt,
      });

      expect(bus.id).toBe(id);
      expect(bus.createdAt).toBe(createdAt);
      expect(bus.updatedAt).toBe(updatedAt);
      expect(bus.model).toBe('Volvo 9700');
      expect(bus.enterpriseId).toBe('0193b1a0-0000-7bbb-8bbb-000000000002');
    });
  });

  describe('updateModel', () => {
    it('mutates model and advances updatedAt', async () => {
      const bus = Bus.create({
        model: 'Old',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001',
      });
      const originalUpdatedAt = bus.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      bus.updateModel('New');

      expect(bus.model).toBe('New');
      expect(bus.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateEnterpriseId', () => {
    it('mutates enterpriseId and advances updatedAt', async () => {
      const bus = Bus.create({ model: 'M', enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001' });
      const originalUpdatedAt = bus.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      bus.updateEnterpriseId('0193b1a0-0000-7bbb-8bbb-000000000099');

      expect(bus.enterpriseId).toBe('0193b1a0-0000-7bbb-8bbb-000000000099');
      expect(bus.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
