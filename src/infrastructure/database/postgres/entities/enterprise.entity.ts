import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';
import { UserEntitySchema } from './user.entity';

const EnterpriseEntitySchema = defineEntity({
  name: 'EnterpriseEntity',
  tableName: 'enterprises',
  extends: BaseEntity,
  properties: {
    name: p.string(),
    legalId: p.string().unique(),
    owner: () => p.oneToOne(UserEntitySchema).mapToPk(),
  },
});

export class EnterpriseEntity extends EnterpriseEntitySchema.class {
  constructor(name: string, legalId: string, ownerId: string) {
    super();
    this.name = name;
    this.legalId = legalId;
    this.owner = ownerId;
  }
}

EnterpriseEntitySchema.setClass(EnterpriseEntity);

export { EnterpriseEntitySchema };
