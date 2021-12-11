import BackendError from "./backend_error";

/**
 *
 * @description Entity Not found exception class
 *
 */
export default class EntityNotFound extends BackendError {
  constructor(message: string | undefined, entity: string) {
    super(message, 404);
    this.name = `Entity Not Found: ${entity}`;
  }
}
