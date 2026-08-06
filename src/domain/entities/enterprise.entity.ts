import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export interface EnterpriseProperties extends BaseEntityProps {
  name: string;
  legalId: string;
  ownerId: string;
}

export interface CreateEnterpriseParams {
  name: string;
  legalId: string;
  ownerId: string;
}

export interface ReconstructEnterpriseParams extends BaseEntityProps {
  name: string;
  legalId: string;
  ownerId: string;
}

export class Enterprise extends BaseEntity {
  private _name: string;
  private readonly _legalId: string;
  private _ownerId: string;

  private constructor(props: EnterpriseProperties) {
    super(props);
    this._name = props.name;
    this._legalId = props.legalId;
    this._ownerId = props.ownerId;
  }

  static create(params: CreateEnterpriseParams): Enterprise {
    return new Enterprise({
      ...generateBaseEntityProps(),
      name: params.name,
      legalId: params.legalId,
      ownerId: params.ownerId,
    });
  }

  static reconstruct(params: ReconstructEnterpriseParams): Enterprise {
    return new Enterprise(params);
  }

  get name(): string {
    return this._name;
  }

  get legalId(): string {
    return this._legalId;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  updateName(name: string): void {
    this._name = name;
    this.touch();
  }

  updateOwnerId(ownerId: string): void {
    this._ownerId = ownerId;
    this.touch();
  }
}
