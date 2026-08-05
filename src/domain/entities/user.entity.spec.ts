import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('creates a user with name, email, role, enterpriseId and base entity props', () => {
      const user = User.create({
        name: 'Jane Driver',
        email: 'jane@acme.com',
        role: 'driver',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001',
      });

      expect(user.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(user.name).toBe('Jane Driver');
      expect(user.email).toBe('jane@acme.com');
      expect(user.role).toBe('driver');
      expect(user.enterpriseId).toBe('0193b1a0-0000-7bbb-8bbb-000000000001');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000000';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');

      const user = User.reconstruct({
        id,
        name: 'Bob Admin',
        email: 'bob@acme.com',
        role: 'admin',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000002',
        createdAt,
        updatedAt,
      });

      expect(user.id).toBe(id);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
      expect(user.name).toBe('Bob Admin');
      expect(user.email).toBe('bob@acme.com');
      expect(user.role).toBe('admin');
      expect(user.enterpriseId).toBe('0193b1a0-0000-7bbb-8bbb-000000000002');
    });
  });

  describe('updateName', () => {
    it('mutates name and advances updatedAt', async () => {
      const user = User.create({
        name: 'Old',
        email: 'a@b.com',
        role: 'user',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001',
      });
      const originalUpdatedAt = user.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      user.updateName('New');

      expect(user.name).toBe('New');
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateEmail', () => {
    it('mutates email and advances updatedAt', async () => {
      const user = User.create({
        name: 'N',
        email: 'old@b.com',
        role: 'user',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001',
      });
      const originalUpdatedAt = user.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      user.updateEmail('new@b.com');

      expect(user.email).toBe('new@b.com');
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateRole', () => {
    it('mutates role and advances updatedAt', async () => {
      const user = User.create({
        name: 'N',
        email: 'a@b.com',
        role: 'user',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001',
      });
      const originalUpdatedAt = user.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      user.updateRole('admin');

      expect(user.role).toBe('admin');
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateEnterpriseId', () => {
    it('mutates enterpriseId and advances updatedAt', async () => {
      const user = User.create({
        name: 'N',
        email: 'a@b.com',
        role: 'user',
        enterpriseId: '0193b1a0-0000-7bbb-8bbb-000000000001',
      });
      const originalUpdatedAt = user.updatedAt;

      await new Promise((r) => setTimeout(r, 5));
      user.updateEnterpriseId('0193b1a0-0000-7bbb-8bbb-000000000099');

      expect(user.enterpriseId).toBe('0193b1a0-0000-7bbb-8bbb-000000000099');
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
