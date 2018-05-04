import {Next, Response, Request} from "restify";

export default function (req: Request, res: Response, next: Next) {
    res.send("pong");
    next();
}
