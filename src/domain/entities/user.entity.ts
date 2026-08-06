import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export const USER_ROLES = ['admin', 'driver', 'user'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface UserProperties extends BaseEntityProps {
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserParams {
  name: string;
  email: string;
  role: UserRole;
}

export interface ReconstructUserParams extends BaseEntityProps {
  name: string;
  email: string;
  role: UserRole;
}

export class User extends BaseEntity {
  private _name: string;
  private _email: string;
  private _role: UserRole;

  private constructor(props: UserProperties) {
    super(props);
    this._name = props.name;
    this._email = props.email;
    this._role = props.role;
  }

  static create(params: CreateUserParams): User {
    return new User({
      ...generateBaseEntityProps(),
      name: params.name,
      email: params.email,
      role: params.role,
    });
  }

  static reconstruct(params: ReconstructUserParams): User {
    return new User(params);
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  updateName(name: string): void {
    this._name = name;
    this.touch();
  }

  updateEmail(email: string): void {
    this._email = email;
    this.touch();
  }

  updateRole(role: UserRole): void {
    this._role = role;
    this.touch();
  }
}
