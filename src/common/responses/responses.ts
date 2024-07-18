// src/common/responses.ts
export interface SuccessResponse<T> {
  response: 'success';
  message: string;
  data: T;
}

export interface ErrorResponse {
  response: 'error';
  statusCode: number;
  message: string;
}
