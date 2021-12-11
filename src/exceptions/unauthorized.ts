import BackendError from "./backend_error";

/**
 *
 * @description Un authorized exception class
 *
 */
export default class UnAuthorized extends BackendError {
  constructor(message: string | undefined) {
    super(message, 401);
    this.name = "Unauthorized";
  }
}
