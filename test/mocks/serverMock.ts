import * as restify from "restify";
import {Request} from "restify";
import {Response} from "restify";
import {Next} from "restify";
import {itemMock} from "./itemMock";

let server = restify.createServer({
    name: "Typescript Api Mock"
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.urlEncodedBodyParser());
server.pre(restify.pre.sanitizePath());

server.get("/items/:id", (req: Request, res: Response, next: Next) => {
    res.send(itemMock);
    next();
});

server.post("/items", (req: Request, res: Response, next: Next) => {
    return res.send(201, {"itemId": "2e97175f-331c-46cc-8699-31a139a6f905"});
});

server.put("/items", (req: Request, res: Response, next: Next) => {
    return res.send(200, {"itemid": "2e97175f-331c-46cc-8699-31a139a6f905"});
});

server.listen(8283, function() {
    console.log("%s listening at %s", server.name, server.url);
});
