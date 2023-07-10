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
  hasNext: boolean,
  hasPrev: boolean,
  pageNumber: number,
  pageSize: number,
  totalPages: number,
  totalRecords: number,
}

export interface Response<T> {
  error?: string,
  data?: T,
}

export interface PagedResponse<T> extends Response<T>, Paged {

}
