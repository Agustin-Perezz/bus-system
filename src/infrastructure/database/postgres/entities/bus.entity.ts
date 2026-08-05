import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';
import { EnterpriseEntitySchema } from './enterprise.entity';

const BusEntitySchema = defineEntity({
  name: 'BusEntity',
  tableName: 'buses',
  extends: BaseEntity,
  properties: {
    model: p.string(),
    enterprise: () => p.manyToOne(EnterpriseEntitySchema).mapToPk(),
  },
});

export class BusEntity extends BusEntitySchema.class {
  constructor(model: string, enterpriseId: string) {
    super();
    this.model = model;
    this.enterprise = enterpriseId;
  }
}

BusEntitySchema.setClass(BusEntity);

export { BusEntitySchema };
