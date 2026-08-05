import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { v7 as uuidv7 } from 'uuid';

import { TripEntity } from '../entities/trip.entity';

export class TripFactory extends Factory<TripEntity> {
  model = TripEntity;

  definition(): Partial<TripEntity> {
    return {
      departureAt: faker.date.future(),
      route: uuidv7(),
    };
  }
}
