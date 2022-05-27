export interface TokenData {
  token: string,
  expiration: string,
}

export interface ValidationError {
  type: string,
  title: string,
  status: number,
  traceId: string,
  errors: any
}

export interface ApiResponse<T> {
  success: boolean,
  message: string | null,
  data?: T,
}
