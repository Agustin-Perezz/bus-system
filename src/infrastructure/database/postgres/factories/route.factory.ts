import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { RouteEntity } from '../entities/route.entity';

export class RouteFactory extends Factory<RouteEntity> {
  model = RouteEntity;

  definition(): Partial<RouteEntity> {
    return {
      name: `${faker.location.street()} Line`,
      origin: faker.location.city(),
      destination: faker.location.city(),
    };
  }
}
