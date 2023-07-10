import type { Model } from './model';

export interface Role {
  ID: number;
  Name: string;
}

export interface User extends Model {
  Name: string;
  Email: string;
  Password?: string;
  Status: string;
  Roles: Role[];
}
