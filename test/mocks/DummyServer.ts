import * as config from "config";

import {Server} from "restify";
import {ServerBuilder} from "../../src/server/ServerBuilder";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import {DummyRouter} from "./DummyRouter";

export let server: Server = new ServerBuilder()
    .withTimeout(config.get<number>("server.options.timeout"))
    .withSecurity(config.get<boolean>("security.enable"))
    .withRouter(new DummyRouter())
    .withCORS(true)
    .build();

let port = config.get<number>("port") + 1;

server.listen(port, function () {
    LoggerHelper.getDefaultHandler().info("App online on port: " + port);
});