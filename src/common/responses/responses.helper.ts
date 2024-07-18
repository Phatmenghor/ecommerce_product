// src/common/response.helper.ts

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface SuccessResponse<T> {
  response: 'success';
  data: T;
}

export interface ErrorResponse {
  response: 'error';
  message: string;
  statusCode?: number;
}

export const handleSuccess = <T>(data: T): SuccessResponse<T> => {
  return {
    response: 'success',
    data,
  };
};

export const handleError = (error: any): ErrorResponse => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          response: 'error',
          message: 'A resource with this value already exists.',
          statusCode: 409, // Conflict status code
        };
      case 'P2025':
        return {
          response: 'error',
          message: 'Resource not found.',
          statusCode: 404, // Not Found status code
        };
      default:
        return {
          response: 'error',
          message: 'Database error.',
          statusCode: 500, // Internal Server Error status code
        };
    }
  } else if (error instanceof NotFoundException) {
    return {
      response: 'error',
      message: error.message,
      statusCode: 404, // Not Found status code
    };
  } else if (error instanceof BadRequestException) {
    return {
      response: 'error',
      message: error.message,
      statusCode: 400, // Bad Request status code
    };
  }

  // Handle generic or unexpected errors
  return {
    response: 'error',
    message: 'Internal server error.',
    statusCode: 500, // Internal Server Error status code
  };
};
