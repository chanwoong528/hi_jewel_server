//@ts-nocheck

export class CustomError extends Error {
  constructor(name = "", message = "", ...args) {
    super(name, message, ...args);
    this.name = name;
    this.message = message;
  }
}
