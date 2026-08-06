import { defineEntity, p } from '@mikro-orm/core';

import { type UserRole } from '../../../../domain/entities/user.entity';
import { BaseEntity } from './base.entity';

const UserEntitySchema = defineEntity({
  name: 'UserEntity',
  tableName: 'users',
  extends: BaseEntity,
  properties: {
    name: p.string(),
    email: p.string().unique(),
    role: p.string(),
  },
});

export class UserEntity extends UserEntitySchema.class {
  role!: UserRole;

  constructor(name: string, email: string, role: UserRole) {
    super();
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

UserEntitySchema.setClass(UserEntity);

export { UserEntitySchema };
