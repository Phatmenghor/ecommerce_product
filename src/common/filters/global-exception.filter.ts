// src/common/filters/global-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import logger from '../logger/logger'; // Assuming you have a logger configured

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || 'Internal server error';

    // Handling Prisma-specific errors
    if (this.isPrismaError(exception)) {
      status = this.getPrismaErrorStatus(exception);
      message = this.getPrismaErrorMessage(exception);
    } else if (exception.status === HttpStatus.NOT_FOUND) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found.';
    }

    // Log the error using your logger (assuming 'logger' is correctly configured)
    logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      stack: exception.stack, // Optionally log the stack trace for debugging
    });

    // Return a standardized JSON response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private isPrismaError(error: any): boolean {
    // Check if the error is a Prisma error
    return error.code !== undefined && error.code.startsWith('P');
  }

  private getPrismaErrorStatus(error: any): HttpStatus {
    // Map Prisma errors to appropriate HTTP status codes
    switch (error.code) {
      case 'P2002': {
        if (error.meta?.target?.includes('email')) {
          return HttpStatus.CONFLICT;
        }
        break;
      }
      case 'P2025': {
        return HttpStatus.NOT_FOUND;
      }

      default:
        break;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getPrismaErrorMessage(error: any): string {
    switch (error.code) {
      case 'P2002': {
        if (error.meta?.target?.includes('email')) {
          return 'A resource with this value already exists.';
        }
        break;
      }
      case 'P2025': {
        return 'Resource not found.';
      }
      default:
        break;
    }
    return 'Unexpected Prisma request error.';
  }
}
