// throw an error saying password doesn't match up in signup, for try ... catch blocks
export class PasswordMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordMismatchError";
    Object.setPrototypeOf(this, PasswordMismatchError.prototype);
  }
}

// throws an error saying the email is in use, for try ... catch blocks
export class EmailInUseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailInUseError";
    Object.setPrototypeOf(this, EmailInUseError.prototype);
  }
}

// throws an error saying the wrong email/password combo, for try ... catch blocks
export class IncorrectEmailPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IncorrectEmailPasswordError";
    Object.setPrototypeOf(this, IncorrectEmailPasswordError.prototype);
  }
}
