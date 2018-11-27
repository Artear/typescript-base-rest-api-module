import { NotAuthorizedError } from "restify-errors";

export const withSecurity = token => (next) => (req, res) => {
    if (!tokenIsValid(token, req.headers["authorization"])) {
        return res.send(new NotAuthorizedError("invalid Token"));
    }
    next();
};
export const tokenIsValid = (token, authorization) => !!authorization && authorization === token;
