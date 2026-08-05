import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { v7 as uuidv7 } from 'uuid';

import { BusEntity } from '../entities/bus.entity';

export class BusFactory extends Factory<BusEntity> {
  model = BusEntity;

  definition(): Partial<BusEntity> {
    return {
      model: faker.vehicle.model(),
      enterprise: uuidv7(),
    };
  }
}
