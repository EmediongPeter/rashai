import { IErrorResponse } from "src/common/interfaces/response.dto";

export class ServiceException extends Error {
  public code = 400;
  constructor(error: IErrorResponse) {
    super(error.error);
    this.name = 'Service Exception';
    this.code = error.status || this.code;
  }
}
