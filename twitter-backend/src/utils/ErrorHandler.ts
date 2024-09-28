class ErrorHandler extends Error {
  statusCode: number;
  message: string;
  details: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;

    Error.captureStackTrace(this, ErrorHandler);
  }
}

export { ErrorHandler };
