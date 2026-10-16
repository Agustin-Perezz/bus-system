import { defineEntity, p } from '@mikro-orm/core';

import {
  TICKET_CANCELLED_STATUS,
  TICKET_STATUSES,
  type TicketStatus,
} from '../../../../domain/entities/ticket.entity';
import { BaseEntity } from './base.entity';
import { TripEntitySchema } from './trip.entity';
import { UserEntitySchema } from './user.entity';

const TicketEntitySchema = defineEntity({
  name: 'TicketEntity',
  tableName: 'tickets',
  extends: BaseEntity,
  properties: {
    trip: () => p.manyToOne(TripEntitySchema),
    seatId: p.string(),
    user: () => p.manyToOne(UserEntitySchema),
    status: p.enum(TICKET_STATUSES),
    heldUntil: p.datetime().nullable(),
  },
  uniques: [
    {
      properties: ['trip', 'seatId'],
      where: { status: { $ne: TICKET_CANCELLED_STATUS } },
    },
  ],
});

export class TicketEntity extends TicketEntitySchema.class {
  status!: TicketStatus;
  heldUntil!: Date | null;
}

TicketEntitySchema.setClass(TicketEntity);

export { TicketEntitySchema };
