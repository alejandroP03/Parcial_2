import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BusinessError, BusinessLogicException } from './error';

@Catch(BusinessLogicException)
export class BusinessErrorsFilter implements ExceptionFilter {
  catch(exception: BusinessLogicException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = this.mapErrorToStatus(exception.type);
    
    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }

  private mapErrorToStatus(errorType: BusinessError): number {
    switch (errorType) {
      case BusinessError.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case BusinessError.PRECONDITION_FAILED:
        return HttpStatus.BAD_REQUEST;
      case BusinessError.BAD_REQUEST:
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
