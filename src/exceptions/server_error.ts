import BackendError from "./backend_error";

/**
 *
 * @description Server error exception
 *
 */
export default class ServerError extends BackendError {
  constructor(message: string | undefined) {
    super(message, 500);
    this.name = "Server Error";
  }
}
