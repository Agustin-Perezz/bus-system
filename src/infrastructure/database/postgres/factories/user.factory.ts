import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { UserEntity } from '../entities/user.entity';

export class UserFactory extends Factory<UserEntity> {
  model = UserEntity;

  definition(): Partial<UserEntity> {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'driver', 'user']),
    };
  }
}
