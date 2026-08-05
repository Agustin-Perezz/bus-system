import { defineEntity, p } from '@mikro-orm/core';

import { type UserRole } from '../../../../domain/entities/user.entity';
import { BaseEntity } from './base.entity';
import { EnterpriseEntitySchema } from './enterprise.entity';

const UserEntitySchema = defineEntity({
  name: 'UserEntity',
  tableName: 'users',
  extends: BaseEntity,
  properties: {
    name: p.string(),
    email: p.string().unique(),
    role: p.string(),
    enterprise: () => p.manyToOne(EnterpriseEntitySchema).mapToPk(),
  },
});

export class UserEntity extends UserEntitySchema.class {
  role!: UserRole;

  constructor(name: string, email: string, role: UserRole, enterpriseId: string) {
    super();
    this.name = name;
    this.email = email;
    this.role = role;
    this.enterprise = enterpriseId;
  }
}

UserEntitySchema.setClass(UserEntity);

export { UserEntitySchema };
