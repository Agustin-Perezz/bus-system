import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';
import type { BusLayoutGrid } from './bus-layout-grid';

export interface BusLayoutProperties extends BaseEntityProps {
  name: string;
  layoutGrid: BusLayoutGrid;
}

export interface CreateBusLayoutParams {
  name: string;
  layoutGrid: BusLayoutGrid;
}

export interface ReconstructBusLayoutParams extends BaseEntityProps {
  name: string;
  layoutGrid: BusLayoutGrid;
}

export class BusLayout extends BaseEntity {
  private _name: string;
  private _layoutGrid: BusLayoutGrid;

  private constructor(props: BusLayoutProperties) {
    super(props);
    this._name = props.name;
    this._layoutGrid = props.layoutGrid;
  }

  static create(params: CreateBusLayoutParams): BusLayout {
    return new BusLayout({
      ...generateBaseEntityProps(),
      name: params.name,
      layoutGrid: params.layoutGrid,
    });
  }

  static reconstruct(params: ReconstructBusLayoutParams): BusLayout {
    return new BusLayout(params);
  }

  get name(): string {
    return this._name;
  }

  get layoutGrid(): BusLayoutGrid {
    return this._layoutGrid;
  }
}
