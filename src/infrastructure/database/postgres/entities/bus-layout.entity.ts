import { defineEntity, p } from '@mikro-orm/core';

import type { BusLayoutGrid } from '../../../../domain/entities/bus-layout-grid';
import { BaseEntity } from './base.entity';

const BusLayoutEntitySchema = defineEntity({
  name: 'BusLayoutEntity',
  tableName: 'bus_layouts',
  extends: BaseEntity,
  properties: {
    name: p.string(),
    layoutGrid: p.json<BusLayoutGrid>(),
  },
});

export class BusLayoutEntity extends BusLayoutEntitySchema.class {
  constructor(name: string, layoutGrid: BusLayoutGrid) {
    super();
    this.name = name;
    this.layoutGrid = layoutGrid;
  }
}

BusLayoutEntitySchema.setClass(BusLayoutEntity);

export { BusLayoutEntitySchema };
