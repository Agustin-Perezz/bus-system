import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

const RouteEntitySchema = defineEntity({
  name: 'RouteEntity',
  tableName: 'routes',
  extends: BaseEntity,
  properties: {
    name: p.string(),
    origin: p.string(),
    destination: p.string(),
  },
});

export class RouteEntity extends RouteEntitySchema.class {
  constructor(name: string, origin: string, destination: string) {
    super();
    this.name = name;
    this.origin = origin;
    this.destination = destination;
  }
}

RouteEntitySchema.setClass(RouteEntity);

export { RouteEntitySchema };
