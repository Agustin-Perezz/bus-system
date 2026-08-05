import { Enterprise } from './enterprise.entity';

describe('Enterprise Entity', () => {
  describe('create', () => {
    it('creates an enterprise with name, legalId and base entity props', () => {
      const enterprise = Enterprise.create({ name: 'Acme Bus Co.', legalId: 'US-12-3456789' });

      expect(enterprise.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(enterprise.name).toBe('Acme Bus Co.');
      expect(enterprise.legalId).toBe('US-12-3456789');
      expect(enterprise.createdAt).toBeInstanceOf(Date);
      expect(enterprise.updatedAt).toBeInstanceOf(Date);
      expect(enterprise.createdAt.getTime()).toBe(enterprise.updatedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000000';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');

      const enterprise = Enterprise.reconstruct({
        id,
        name: 'RoadRunner Lines',
        legalId: 'AR-30-12345678',
        createdAt,
        updatedAt,
      });

      expect(enterprise.id).toBe(id);
      expect(enterprise.createdAt).toBe(createdAt);
      expect(enterprise.updatedAt).toBe(updatedAt);
      expect(enterprise.name).toBe('RoadRunner Lines');
      expect(enterprise.legalId).toBe('AR-30-12345678');
    });
  });

  describe('updateName', () => {
    it('mutates name and advances updatedAt', async () => {
      const enterprise = Enterprise.create({ name: 'Old Name', legalId: 'X-1' });
      const originalUpdatedAt = enterprise.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      enterprise.updateName('New Name');

      expect(enterprise.name).toBe('New Name');
      expect(enterprise.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('legalId', () => {
    it('is immutable', () => {
      const enterprise = Enterprise.create({ name: 'Acme', legalId: 'X-1' });
      expect(enterprise.legalId).toBe('X-1');
      expect((enterprise as unknown as Record<string, unknown>).updateLegalId).toBeUndefined();
    });
  });
});
