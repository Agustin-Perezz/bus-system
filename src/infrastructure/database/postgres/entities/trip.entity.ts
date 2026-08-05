import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';
import { RouteEntitySchema } from './route.entity';

const TripEntitySchema = defineEntity({
  name: 'TripEntity',
  tableName: 'trips',
  extends: BaseEntity,
  properties: {
    departureAt: p.datetime(),
    route: () => p.manyToOne(RouteEntitySchema).mapToPk(),
  },
});

export class TripEntity extends TripEntitySchema.class {
  constructor(departureAt: Date, routeId: string) {
    super();
    this.departureAt = departureAt;
    this.route = routeId;
  }
}

TripEntitySchema.setClass(TripEntity);

export { TripEntitySchema };
