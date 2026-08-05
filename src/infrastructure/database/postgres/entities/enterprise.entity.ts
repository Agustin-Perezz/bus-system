import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

const EnterpriseEntitySchema = defineEntity({
  name: 'EnterpriseEntity',
  tableName: 'enterprises',
  extends: BaseEntity,
  properties: {
    name: p.string(),
    legalId: p.string().unique(),
  },
});

export class EnterpriseEntity extends EnterpriseEntitySchema.class {
  constructor(name: string, legalId: string) {
    super();
    this.name = name;
    this.legalId = legalId;
  }
}

EnterpriseEntitySchema.setClass(EnterpriseEntity);

export { EnterpriseEntitySchema };
