import { NotAuthorizedError } from "restify-errors";

export const withSecurity = token => (next) => (req, res) => {
    if (shouldValidateMethod(req.method) && !tokenIsValid(token, req.headers["authorization"])) {
        return res.send(new NotAuthorizedError("invalid Token"));
    }
    next();
};
export const shouldValidateMethod = method => ["GET", "POST", "PUT", "PATCH", "DELETE"].indexOf(method) !== -1;
export const tokenIsValid = (token, authorization) => !!authorization && authorization === token;
