import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export interface EnterpriseProperties extends BaseEntityProps {
  name: string;
  legalId: string;
}

export interface CreateEnterpriseParams {
  name: string;
  legalId: string;
}

export interface ReconstructEnterpriseParams extends BaseEntityProps {
  name: string;
  legalId: string;
}

export class Enterprise extends BaseEntity {
  private _name: string;
  private readonly _legalId: string;

  private constructor(props: EnterpriseProperties) {
    super(props);
    this._name = props.name;
    this._legalId = props.legalId;
  }

  static create(params: CreateEnterpriseParams): Enterprise {
    return new Enterprise({
      ...generateBaseEntityProps(),
      name: params.name,
      legalId: params.legalId,
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

  updateName(name: string): void {
    this._name = name;
    this.touch();
  }
}
