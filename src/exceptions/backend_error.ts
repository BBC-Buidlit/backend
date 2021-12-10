export default class BackendError extends Error {
  httpStatusCode: number;

  constructor(message: string | undefined, httpStatusCode = 500) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }
}
