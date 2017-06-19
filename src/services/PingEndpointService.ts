import {Next, Response, Request} from "restify";

export default function (req: Request, res: Response, next: Next) {
    console.log("HIT!");
    res.send("pong");
    next();
}