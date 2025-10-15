import createHttpError from "http-errors";

export const throwHttpError = (statusCode, message) => {
  throw createHttpError(statusCode, message);
};