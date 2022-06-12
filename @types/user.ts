export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  roles?: string[];
}

export interface OperationClaim {
  id: number;
  name: string;
}
