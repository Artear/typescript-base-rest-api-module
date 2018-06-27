import * as config from "config";
import { NotAuthorizedError } from "restify-errors";

export const securityMiddleware = (req, res, next) => {
  if (shouldValidateMethod(req.method) && !tokenIsValid(req.headers["authorization"])) {
      return res.send(new NotAuthorizedError("invalid Token"));
  }
  next();
}

export const shouldValidateMethod = method => ["GET", "POST", "PUT", "PATCH", "DELETE"].indexOf(method) !== -1;

export const tokenIsValid = token => !!token && config.get<string>("security.token") === token;
