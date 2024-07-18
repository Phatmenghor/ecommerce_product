// src/common/filters/not-found.exception.ts

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../responses/responses.helper';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const errorResponse: ErrorResponse = {
      response: 'error',
      message: exception.message || 'Not Found',
      statusCode: status,
    };

    response.status(status).json(errorResponse);
  }
}
