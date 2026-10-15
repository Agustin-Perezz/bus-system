import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import type { BusLayoutTemplate } from '../../../../domain/entities/bus-layout-grid';
import { BusLayoutEntity } from '../entities/bus-layout.entity';

export class BusLayoutTemplateSeeder extends Seeder {
  constructor(private readonly template: BusLayoutTemplate) {
    super();
  }

  override async run(em: EntityManager): Promise<void> {
    const layout = new BusLayoutEntity(this.template.name, this.template.layoutGrid);
    layout.id = this.template.id;
    await em.upsert(BusLayoutEntity, layout);
  }
}
