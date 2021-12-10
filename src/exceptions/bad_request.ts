import BackendError from "./backend_error";

export default class BadRequest extends BackendError {
  constructor(message: string | undefined) {
    super(message, 400);
    this.name = "Bad Request";
  }
}
