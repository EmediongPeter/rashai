import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ServiceException } from '../exception/service.layer.exception';

@Catch(ServiceException)
export class ServiceExceptionFilter extends BaseExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const message = exception.message;
    super.catch(new HttpException(message, exception.code), host);
  }
}
