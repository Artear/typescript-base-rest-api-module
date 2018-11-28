import { NotAuthorizedError } from "restify-errors";

export const withSecurity = token => RequestHandler => (req, res, next) => {
    if (!tokenIsValid(token, req.headers["authorization"])) {
        return res.send(new NotAuthorizedError("invalid Token"));
    }
    return RequestHandler(req, res, next);
};
export const tokenIsValid = (token, authorization) => !!authorization && authorization === token;
