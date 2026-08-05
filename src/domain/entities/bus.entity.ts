import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export interface BusProperties extends BaseEntityProps {
  model: string;
  enterpriseId: string;
}

export interface CreateBusParams {
  model: string;
  enterpriseId: string;
}

export interface ReconstructBusParams extends BaseEntityProps {
  model: string;
  enterpriseId: string;
}

export class Bus extends BaseEntity {
  private _model: string;
  private _enterpriseId: string;

  private constructor(props: BusProperties) {
    super(props);
    this._model = props.model;
    this._enterpriseId = props.enterpriseId;
  }

  static create(params: CreateBusParams): Bus {
    return new Bus({
      ...generateBaseEntityProps(),
      model: params.model,
      enterpriseId: params.enterpriseId,
    });
  }

  static reconstruct(params: ReconstructBusParams): Bus {
    return new Bus(params);
  }

  get model(): string {
    return this._model;
  }

  get enterpriseId(): string {
    return this._enterpriseId;
  }

  updateModel(model: string): void {
    this._model = model;
    this.touch();
  }

  updateEnterpriseId(enterpriseId: string): void {
    this._enterpriseId = enterpriseId;
    this.touch();
  }
}
