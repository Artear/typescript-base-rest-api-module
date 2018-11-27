import * as config from "config";

import {Server} from "restify";
import {ServerBuilder} from "../../src/server/ServerBuilder";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import {DummyRouter} from "./DummyRouter";
import {ServerRouterConfig} from "../../src/server/ServerRouterConfig";

export let server: Server = new ServerBuilder(new ServerRouterConfig())
    .withTimeout(config.get<number>("server.options.timeout"))
    .withRouter(new DummyRouter(config.get<string>("server.options.defaultApiVersion")))
    .withCORS(true)
    .build();

let port = config.get<number>("port") + 1;

server.listen(port, function () {
    LoggerHelper.getDefaultHandler().info("App online on port: " + port);
});
