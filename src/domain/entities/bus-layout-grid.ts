export const BUS_LAYOUT_NODE_TYPES = {
  seat: 'seat',
  aisle: 'aisle',
  bathroom: 'bathroom',
  stairs: 'stairs',
} as const;

export type BusLayoutNodeType = (typeof BUS_LAYOUT_NODE_TYPES)[keyof typeof BUS_LAYOUT_NODE_TYPES];

export const BUS_LAYOUT_LOWER_LEVEL = 1;
export const BUS_LAYOUT_UPPER_LEVEL = 2;

const LEVEL_ID_PREFIXES: Record<number, string> = {
  [BUS_LAYOUT_LOWER_LEVEL]: 'L',
  [BUS_LAYOUT_UPPER_LEVEL]: 'U',
};

export interface BusLayoutGridNode {
  id: string;
  label: string;
  type: BusLayoutNodeType;
  level: number;
  row: number;
  column: number;
}

export interface BusLayoutGrid {
  levels: number;
  rows: number;
  columns: number;
  nodes: BusLayoutGridNode[];
}

export interface BusLayoutTemplate {
  id: string;
  name: string;
  layoutGrid: BusLayoutGrid;
}

const STANDARD_LAYOUT_SEAT_ROW_COUNT = 10;
const DOUBLE_DECKER_LOWER_SEAT_ROW_COUNT = 4;
const DOUBLE_DECKER_UPPER_SEAT_ROW_COUNT = 8;
const SEAT_COLUMN_LETTERS = ['A', 'B', 'C', 'D'] as const;
const LAYOUT_COLUMN_COUNT = 5;
const AISLE_COLUMN = 3;
const DOUBLE_DECKER_STAIRS_COLUMN = 2;
const DOUBLE_DECKER_BATHROOM_COLUMN = 4;

export const STANDARD_BUS_LAYOUT_ID = '01a13f79-ee98-7615-b448-dc2b2165d232';
export const STANDARD_BUS_LAYOUT_NAME = 'Standard 2x2 with aisle and bathroom';

export const DOUBLE_DECKER_BUS_LAYOUT_ID = '01a13f95-7032-766c-990b-98ffc64a2744';
export const DOUBLE_DECKER_BUS_LAYOUT_NAME = 'Double-decker 2x2 with aisle, stairs and bathroom';

export const BUS_LAYOUT_NODE_LABELS = {
  [BUS_LAYOUT_NODE_TYPES.aisle]: 'Aisle',
  [BUS_LAYOUT_NODE_TYPES.bathroom]: 'Bathroom',
  [BUS_LAYOUT_NODE_TYPES.stairs]: 'Stairs',
} as const;

function buildSeatNodeId(level: number, levels: number, seatCode: string): string {
  if (levels === 1) {
    return seatCode;
  }
  return `${LEVEL_ID_PREFIXES[level]}${seatCode}`;
}

function buildAisleNodeId(level: number, levels: number, row: number): string {
  if (levels === 1) {
    return `aisle-${row}`;
  }
  return `aisle-${level}-${row}`;
}

function buildDeckSeatNodes(
  level: number,
  levels: number,
  seatRowCount: number,
): BusLayoutGridNode[] {
  const nodes: BusLayoutGridNode[] = [];

  for (let row = 1; row <= seatRowCount; row += 1) {
    nodes.push({
      id: buildAisleNodeId(level, levels, row),
      label: BUS_LAYOUT_NODE_LABELS[BUS_LAYOUT_NODE_TYPES.aisle],
      type: BUS_LAYOUT_NODE_TYPES.aisle,
      level,
      row,
      column: AISLE_COLUMN,
    });

    let letterIndex = 0;
    for (let column = 1; column <= LAYOUT_COLUMN_COUNT; column += 1) {
      if (column === AISLE_COLUMN) {
        continue;
      }

      const seatCode = `${row}${SEAT_COLUMN_LETTERS[letterIndex]}`;
      letterIndex += 1;
      nodes.push({
        id: buildSeatNodeId(level, levels, seatCode),
        label: seatCode,
        type: BUS_LAYOUT_NODE_TYPES.seat,
        level,
        row,
        column,
      });
    }
  }

  return nodes;
}

export function buildStandardBusLayoutGrid(): BusLayoutGrid {
  const nodes = buildDeckSeatNodes(BUS_LAYOUT_LOWER_LEVEL, 1, STANDARD_LAYOUT_SEAT_ROW_COUNT);

  const bathroomRow = STANDARD_LAYOUT_SEAT_ROW_COUNT + 1;
  nodes.push({
    id: 'bathroom',
    label: BUS_LAYOUT_NODE_LABELS[BUS_LAYOUT_NODE_TYPES.bathroom],
    type: BUS_LAYOUT_NODE_TYPES.bathroom,
    level: BUS_LAYOUT_LOWER_LEVEL,
    row: bathroomRow,
    column: AISLE_COLUMN,
  });

  return {
    levels: 1,
    rows: bathroomRow,
    columns: LAYOUT_COLUMN_COUNT,
    nodes,
  };
}

export function buildDoubleDeckerBusLayoutGrid(): BusLayoutGrid {
  const nodes = [
    ...buildDeckSeatNodes(BUS_LAYOUT_LOWER_LEVEL, 2, DOUBLE_DECKER_LOWER_SEAT_ROW_COUNT),
    ...buildDeckSeatNodes(BUS_LAYOUT_UPPER_LEVEL, 2, DOUBLE_DECKER_UPPER_SEAT_ROW_COUNT),
  ];

  nodes.push({
    id: 'stairs-lower',
    label: BUS_LAYOUT_NODE_LABELS[BUS_LAYOUT_NODE_TYPES.stairs],
    type: BUS_LAYOUT_NODE_TYPES.stairs,
    level: BUS_LAYOUT_LOWER_LEVEL,
    row: DOUBLE_DECKER_LOWER_SEAT_ROW_COUNT + 1,
    column: DOUBLE_DECKER_STAIRS_COLUMN,
  });

  nodes.push({
    id: 'bathroom-lower',
    label: BUS_LAYOUT_NODE_LABELS[BUS_LAYOUT_NODE_TYPES.bathroom],
    type: BUS_LAYOUT_NODE_TYPES.bathroom,
    level: BUS_LAYOUT_LOWER_LEVEL,
    row: DOUBLE_DECKER_LOWER_SEAT_ROW_COUNT + 1,
    column: DOUBLE_DECKER_BATHROOM_COLUMN,
  });

  nodes.push({
    id: 'stairs-upper',
    label: BUS_LAYOUT_NODE_LABELS[BUS_LAYOUT_NODE_TYPES.stairs],
    type: BUS_LAYOUT_NODE_TYPES.stairs,
    level: BUS_LAYOUT_UPPER_LEVEL,
    row: DOUBLE_DECKER_UPPER_SEAT_ROW_COUNT + 1,
    column: DOUBLE_DECKER_STAIRS_COLUMN,
  });

  return {
    levels: 2,
    rows: DOUBLE_DECKER_UPPER_SEAT_ROW_COUNT + 1,
    columns: LAYOUT_COLUMN_COUNT,
    nodes,
  };
}

export const STANDARD_BUS_LAYOUT: BusLayoutTemplate = {
  id: STANDARD_BUS_LAYOUT_ID,
  name: STANDARD_BUS_LAYOUT_NAME,
  layoutGrid: buildStandardBusLayoutGrid(),
};

export const DOUBLE_DECKER_BUS_LAYOUT: BusLayoutTemplate = {
  id: DOUBLE_DECKER_BUS_LAYOUT_ID,
  name: DOUBLE_DECKER_BUS_LAYOUT_NAME,
  layoutGrid: buildDoubleDeckerBusLayoutGrid(),
};
