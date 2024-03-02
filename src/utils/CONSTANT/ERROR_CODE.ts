import {
  ValidationError,
  UniqueConstraintError,
  EmptyResultError,
  DatabaseError,
} from "sequelize";

const ERROR_CODE = {
  SequelizeValidationError: {
    message: "Input validation ERROR",
    errorInstance: ValidationError,
    code: 422,
  },
  SequelizeUniqueConstraintError: {
    message: "Input validation ERROR: Unique",
    errorInstance: UniqueConstraintError,
    code: 422,
  },
  NotFoundError: {
    message: "Result Not Found",
    errorInstance: EmptyResultError,
    code: 404,
  },
  SequelizeDatabaseError: {
    message: "Database Error",
    errorInstance: DatabaseError,
    code: 500,
  },

  JsonWebTokenError: {
    message: "Invalid Token",
    errorInstance: "JsonWebTokenError",
    code: 401,
  },
  TokenExpiredError: {
    message: "Expired Token",
    errorInstance: "TokenExpiredError",
    code: 498,
  },
  PasswordIncorrectError: {
    message: "Password not correct",
    errorInstance: "PasswordIncorrectError",
    code: 401,
  },
  AuthorizeLevelNotMatch: {
    message: "Authorize Level Not Match",
    errorInstance: "AuthorizeLevelNotMatch",
    code: 401,
  },
  UnsupportedType: {
    message: "Unsupported Type",
    errorInstance: "UnsupportedTypeError",
    code: 422,
  },
};

export default ERROR_CODE;
