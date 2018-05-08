import * as config from "config";

if (config.get<boolean>("newrelic.enable")) {
    require("newrelic");
}

import {Server, ServerOptions} from "restify";
import {OptionsBuilder} from "../../src/server/OptionsBuilder";
import {ServerBuilder} from "../../src/server/ServerBuilder";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import currentRoutes from "./current/Routes";
import stableRoutes from "./stable/Routes";
import {ServerRouterConfig} from "../../src/server/ServerRouterConfig";

let options: ServerOptions = new OptionsBuilder()
    .withName(config.get<string>("server.options.name"))
    .withVersion(config.get<string>("server.options.version"))
    .build();

export let server: Server = new ServerBuilder(new ServerRouterConfig())
    .withTimeout(config.get<number>("server.options.timeout"))
    .withOptions(options)
    .withRouterList(currentRoutes)
    .withRouterList(stableRoutes)
    .withSecurity(config.get<boolean>("security.enable"))
    .withCORS(false)
    .withMorgan()
    .withBugsnag()
    .build();


let port = config.get<number>("port");

server.listen(port, function () {
    LoggerHelper.getDefaultHandler().info("App online on port: " + port);
});
