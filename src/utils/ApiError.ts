class ApiError<T> extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: T[] | undefined,
    public stack?: string | undefined,
    public data?: any | null,
    public success?: boolean
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
