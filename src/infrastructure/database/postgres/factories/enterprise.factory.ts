import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { EnterpriseEntity } from '../entities/enterprise.entity';

export class EnterpriseFactory extends Factory<EnterpriseEntity> {
  model = EnterpriseEntity;

  definition(): Partial<EnterpriseEntity> {
    return {
      name: faker.company.name(),
      legalId: faker.string.alphanumeric(10),
    };
  }
}
