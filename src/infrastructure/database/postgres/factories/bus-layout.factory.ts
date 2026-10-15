import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { buildStandardBusLayoutGrid } from '../../../../domain/entities/bus-layout-grid';
import { BusLayoutEntity } from '../entities/bus-layout.entity';

export class BusLayoutFactory extends Factory<BusLayoutEntity> {
  model = BusLayoutEntity;

  definition(): Partial<BusLayoutEntity> {
    return {
      name: `${faker.vehicle.model()} layout`,
      layoutGrid: buildStandardBusLayoutGrid(),
    };
  }
}
