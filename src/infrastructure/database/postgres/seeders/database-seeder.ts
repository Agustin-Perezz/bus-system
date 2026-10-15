import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import {
  DOUBLE_DECKER_BUS_LAYOUT,
  STANDARD_BUS_LAYOUT,
} from '../../../../domain/entities/bus-layout-grid';
import { BusLayoutTemplateSeeder } from './bus-layout-template-seeder';

export class DatabaseSeeder extends Seeder {
  override async run(em: EntityManager): Promise<void> {
    await new BusLayoutTemplateSeeder(STANDARD_BUS_LAYOUT).run(em);
    await new BusLayoutTemplateSeeder(DOUBLE_DECKER_BUS_LAYOUT).run(em);
  }
}
