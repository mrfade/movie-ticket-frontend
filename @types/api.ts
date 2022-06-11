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

export interface Paged {
  pageNumber: number,
  pageSize: number,
  totalPages: number,
  totalRecords: number,
}

export interface ApiResponse<T> {
  success: boolean,
  message: string | null,
  data?: T,
}

export interface ApiResponsePaged<T> extends ApiResponse<T>, Paged {

}
