import { BusLayout } from './bus-layout.entity';
import { buildStandardBusLayoutGrid } from './bus-layout-grid';

describe('BusLayout Entity', () => {
  describe('create', () => {
    it('creates a bus layout with name, layoutGrid and base entity props', () => {
      const layout = BusLayout.create({
        name: 'Standard 2x2 with aisle and bathroom',
        layoutGrid: buildStandardBusLayoutGrid(),
      });

      expect(layout.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(layout.name).toBe('Standard 2x2 with aisle and bathroom');
      expect(layout.layoutGrid).toEqual(buildStandardBusLayoutGrid());
      expect(layout.createdAt).toBeInstanceOf(Date);
      expect(layout.updatedAt).toBeInstanceOf(Date);
      expect(layout.createdAt.getTime()).toBe(layout.updatedAt.getTime());
    });
  });

  describe('reconstruct', () => {
    it('hydrates from explicit props without regenerating id or timestamps', () => {
      const id = '0193b1a0-0000-7bbb-8bbb-000000000010';
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');
      const layoutGrid = buildStandardBusLayoutGrid();

      const layout = BusLayout.reconstruct({
        id,
        name: 'Double-decker 1x2',
        layoutGrid,
        createdAt,
        updatedAt,
      });

      expect(layout.id).toBe(id);
      expect(layout.createdAt).toBe(createdAt);
      expect(layout.updatedAt).toBe(updatedAt);
      expect(layout.name).toBe('Double-decker 1x2');
      expect(layout.layoutGrid).toBe(layoutGrid);
    });
  });
});
