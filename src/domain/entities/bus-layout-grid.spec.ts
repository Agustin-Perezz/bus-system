import {
  BUS_LAYOUT_LOWER_LEVEL,
  BUS_LAYOUT_NODE_TYPES,
  BUS_LAYOUT_UPPER_LEVEL,
  buildDoubleDeckerBusLayoutGrid,
  buildStandardBusLayoutGrid,
  DOUBLE_DECKER_BUS_LAYOUT,
  DOUBLE_DECKER_BUS_LAYOUT_ID,
  DOUBLE_DECKER_BUS_LAYOUT_NAME,
  STANDARD_BUS_LAYOUT,
  STANDARD_BUS_LAYOUT_ID,
  STANDARD_BUS_LAYOUT_NAME,
} from './bus-layout-grid';

describe('BusLayoutGrid', () => {
  describe('buildStandardBusLayoutGrid', () => {
    it('builds a single-deck 2x2 seat grid with an aisle per row and a bathroom at the back', () => {
      const grid = buildStandardBusLayoutGrid();

      expect(grid.levels).toBe(1);
      expect(grid.rows).toBe(11);
      expect(grid.columns).toBe(5);

      const seatNodes = grid.nodes.filter((node) => node.type === BUS_LAYOUT_NODE_TYPES.seat);
      const aisleNodes = grid.nodes.filter((node) => node.type === BUS_LAYOUT_NODE_TYPES.aisle);
      const bathroomNodes = grid.nodes.filter(
        (node) => node.type === BUS_LAYOUT_NODE_TYPES.bathroom,
      );

      expect(seatNodes).toHaveLength(40);
      expect(aisleNodes).toHaveLength(10);
      expect(bathroomNodes).toHaveLength(1);
    });

    it('names seat nodes with row and column letters matching the 1A format', () => {
      const grid = buildStandardBusLayoutGrid();

      expect(grid.nodes.map((node) => node.id)).toContain('1A');
      expect(grid.nodes.map((node) => node.id)).toContain('10D');
      expect(grid.nodes.map((node) => node.id)).not.toContain('11A');
    });

    it('assigns every node to the lower level with the seat label equal to the id', () => {
      const grid = buildStandardBusLayoutGrid();

      for (const node of grid.nodes) {
        expect(node.level).toBe(BUS_LAYOUT_LOWER_LEVEL);
      }

      const seat = grid.nodes.find((node) => node.id === '1A');
      expect(seat?.label).toBe('1A');
    });

    it('keeps every node position inside the grid bounds', () => {
      const grid = buildStandardBusLayoutGrid();

      for (const node of grid.nodes) {
        expect(node.row).toBeGreaterThanOrEqual(1);
        expect(node.row).toBeLessThanOrEqual(grid.rows);
        expect(node.column).toBeGreaterThanOrEqual(1);
        expect(node.column).toBeLessThanOrEqual(grid.columns);
      }
    });
  });

  describe('buildDoubleDeckerBusLayoutGrid', () => {
    it('builds a two-level grid with seats on both decks', () => {
      const grid = buildDoubleDeckerBusLayoutGrid();

      expect(grid.levels).toBe(2);
      expect(grid.columns).toBe(5);

      const lowerSeats = grid.nodes.filter(
        (node) => node.type === BUS_LAYOUT_NODE_TYPES.seat && node.level === BUS_LAYOUT_LOWER_LEVEL,
      );
      const upperSeats = grid.nodes.filter(
        (node) => node.type === BUS_LAYOUT_NODE_TYPES.seat && node.level === BUS_LAYOUT_UPPER_LEVEL,
      );

      expect(lowerSeats).toHaveLength(16);
      expect(upperSeats).toHaveLength(32);
    });

    it('prefixes seat ids with the deck letter while labels repeat per deck', () => {
      const grid = buildDoubleDeckerBusLayoutGrid();

      const lowerSeat = grid.nodes.find((node) => node.id === 'L1A');
      const upperSeat = grid.nodes.find((node) => node.id === 'U1A');

      expect(lowerSeat?.level).toBe(BUS_LAYOUT_LOWER_LEVEL);
      expect(lowerSeat?.label).toBe('1A');
      expect(upperSeat?.level).toBe(BUS_LAYOUT_UPPER_LEVEL);
      expect(upperSeat?.label).toBe('1A');
    });

    it('keeps node ids unique across the whole layout', () => {
      for (const grid of [buildStandardBusLayoutGrid(), buildDoubleDeckerBusLayoutGrid()]) {
        const ids = grid.nodes.map((node) => node.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });

    it('marks stairs on both decks and a bathroom on the lower deck', () => {
      const grid = buildDoubleDeckerBusLayoutGrid();

      const stairs = grid.nodes.filter((node) => node.type === BUS_LAYOUT_NODE_TYPES.stairs);
      const bathrooms = grid.nodes.filter((node) => node.type === BUS_LAYOUT_NODE_TYPES.bathroom);

      expect(stairs.map((node) => node.id)).toEqual(
        expect.arrayContaining(['stairs-lower', 'stairs-upper']),
      );
      expect(bathrooms.map((node) => node.id)).toEqual(['bathroom-lower']);
    });

    it('keeps every node position inside the grid bounds and on a valid level', () => {
      const grid = buildDoubleDeckerBusLayoutGrid();

      for (const node of grid.nodes) {
        expect(node.level).toBeGreaterThanOrEqual(BUS_LAYOUT_LOWER_LEVEL);
        expect(node.level).toBeLessThanOrEqual(grid.levels);
        expect(node.row).toBeGreaterThanOrEqual(1);
        expect(node.row).toBeLessThanOrEqual(grid.rows);
        expect(node.column).toBeGreaterThanOrEqual(1);
        expect(node.column).toBeLessThanOrEqual(grid.columns);
      }
    });
  });

  describe('STANDARD_BUS_LAYOUT fixture', () => {
    it('exposes the standard template with a deterministic UUIDv7 id', () => {
      expect(STANDARD_BUS_LAYOUT.id).toBe(STANDARD_BUS_LAYOUT_ID);
      expect(STANDARD_BUS_LAYOUT.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(STANDARD_BUS_LAYOUT.name).toBe(STANDARD_BUS_LAYOUT_NAME);
      expect(STANDARD_BUS_LAYOUT.layoutGrid).toEqual(buildStandardBusLayoutGrid());
    });
  });

  describe('DOUBLE_DECKER_BUS_LAYOUT fixture', () => {
    it('exposes the double-decker template with a deterministic UUIDv7 id', () => {
      expect(DOUBLE_DECKER_BUS_LAYOUT.id).toBe(DOUBLE_DECKER_BUS_LAYOUT_ID);
      expect(DOUBLE_DECKER_BUS_LAYOUT.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(DOUBLE_DECKER_BUS_LAYOUT.name).toBe(DOUBLE_DECKER_BUS_LAYOUT_NAME);
      expect(DOUBLE_DECKER_BUS_LAYOUT.layoutGrid).toEqual(buildDoubleDeckerBusLayoutGrid());
    });
  });
});
