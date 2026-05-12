export class PasswordMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordMismatchError";
    Object.setPrototypeOf(this, PasswordMismatchError.prototype);
  }
}
