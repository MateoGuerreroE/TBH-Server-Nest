export class CustomError extends Error {
  cause: string | undefined;
  constructor(message: string, cause?: string) {
    super(`${message}`);
    this.cause = cause;
  }

  getCause(): string | undefined {
    return this.cause;
  }
}

export class DataError extends CustomError {
  constructor(message: string, cause?: string) {
    super(`[DataError]: ${message}`, cause);
  }
}

export class BusinessError extends CustomError {
  constructor(message: string, cause: string) {
    super(`[BS]: ${message} - ${cause}`, cause);
  }
}

export class ControllerError extends CustomError {
  constructor(message: string, cause: string) {
    super(`[Controller]: ${message} - ${cause}`, cause);
  }
}
