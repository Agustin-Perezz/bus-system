import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';
import { v7 as uuidv7 } from 'uuid';

import { TICKET_HELD_STATUS } from '../../../../domain/entities/ticket.entity';
import { TicketEntity } from '../entities/ticket.entity';
import { TripEntity } from '../entities/trip.entity';
import { UserEntity } from '../entities/user.entity';

export class TicketFactory extends Factory<TicketEntity> {
  model = TicketEntity;

  definition(): Partial<TicketEntity> {
    return {
      trip: this.em.getReference(TripEntity, uuidv7()),
      seatId: `${faker.number.int({ min: 1, max: 10 })}A`,
      user: this.em.getReference(UserEntity, uuidv7()),
      status: TICKET_HELD_STATUS,
      heldUntil: faker.date.future(),
    };
  }
}
