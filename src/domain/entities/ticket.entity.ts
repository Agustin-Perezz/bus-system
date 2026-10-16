import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export const TICKET_HELD_STATUS = 'held';
export const TICKET_BOOKED_STATUS = 'booked';
export const TICKET_CANCELLED_STATUS = 'cancelled';

export const TICKET_STATUSES = [
  TICKET_HELD_STATUS,
  TICKET_BOOKED_STATUS,
  TICKET_CANCELLED_STATUS,
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_HELD_WITHOUT_HOLD_UNTIL_ERROR = 'A held ticket requires a hold expiration';
export const TICKET_BOOKED_WITH_HOLD_UNTIL_ERROR = 'A booked ticket cannot have a hold expiration';
export const TICKET_CONFIRM_NOT_HELD_ERROR = 'Only a held ticket can be confirmed';
export const TICKET_CANCEL_CANCELLED_ERROR = 'A cancelled ticket cannot be cancelled again';

export interface TicketProperties extends BaseEntityProps {
  tripId: string;
  seatId: string;
  userId: string;
  status: TicketStatus;
  heldUntil: Date | null;
}

export interface CreateTicketParams {
  tripId: string;
  seatId: string;
  userId: string;
  status: typeof TICKET_HELD_STATUS | typeof TICKET_BOOKED_STATUS;
  heldUntil?: Date | null;
}

export interface ReconstructTicketParams extends BaseEntityProps {
  tripId: string;
  seatId: string;
  userId: string;
  status: TicketStatus;
  heldUntil: Date | null;
}

export class Ticket extends BaseEntity {
  private _tripId: string;
  private _seatId: string;
  private _userId: string;
  private _status: TicketStatus;
  private _heldUntil: Date | null;

  private constructor(props: TicketProperties) {
    super(props);
    this._tripId = props.tripId;
    this._seatId = props.seatId;
    this._userId = props.userId;
    this._status = props.status;
    this._heldUntil = props.heldUntil;
  }

  static create(params: CreateTicketParams): Ticket {
    const heldUntil = params.heldUntil ?? null;

    if (params.status === TICKET_HELD_STATUS && !heldUntil) {
      throw new Error(TICKET_HELD_WITHOUT_HOLD_UNTIL_ERROR);
    }

    if (params.status === TICKET_BOOKED_STATUS && heldUntil) {
      throw new Error(TICKET_BOOKED_WITH_HOLD_UNTIL_ERROR);
    }

    return new Ticket({
      ...generateBaseEntityProps(),
      tripId: params.tripId,
      seatId: params.seatId,
      userId: params.userId,
      status: params.status,
      heldUntil,
    });
  }

  static reconstruct(params: ReconstructTicketParams): Ticket {
    return new Ticket(params);
  }

  get tripId(): string {
    return this._tripId;
  }

  get seatId(): string {
    return this._seatId;
  }

  get userId(): string {
    return this._userId;
  }

  get status(): TicketStatus {
    return this._status;
  }

  get heldUntil(): Date | null {
    return this._heldUntil;
  }

  isActive(): boolean {
    return this._status !== TICKET_CANCELLED_STATUS;
  }

  hasExpiredHold(now: Date): boolean {
    if (this._status !== TICKET_HELD_STATUS || this._heldUntil === null) {
      return false;
    }

    return this._heldUntil.getTime() <= now.getTime();
  }

  confirm(): void {
    if (this._status !== TICKET_HELD_STATUS) {
      throw new Error(TICKET_CONFIRM_NOT_HELD_ERROR);
    }

    this._status = TICKET_BOOKED_STATUS;
    this._heldUntil = null;
    this.touch();
  }

  cancel(): void {
    if (this._status === TICKET_CANCELLED_STATUS) {
      throw new Error(TICKET_CANCEL_CANCELLED_ERROR);
    }

    this._status = TICKET_CANCELLED_STATUS;
    this._heldUntil = null;
    this.touch();
  }
}
