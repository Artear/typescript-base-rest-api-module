import * as restify from "restify";

export default (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.charSet("utf-8");
    next();
};