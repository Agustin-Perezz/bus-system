import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { TicketEntitySchema } from './infrastructure/database/postgres/entities/ticket.entity';

@Module({
  imports: [MikroOrmModule.forFeature([TicketEntitySchema])],
})
export class TicketsModule {}
