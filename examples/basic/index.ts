import * as config from "config";

if (config.get<boolean>("newrelic.enable")) {
    require("newrelic");
}

import {queryParser, Server, ServerOptions} from "restify";
import {OptionsBuilder} from "../../src/server/OptionsBuilder";
import {ServerBuilder} from "../../src/server/ServerBuilder";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import currentRoutes from "./current/Routes";
import stableRoutes from "./stable/Routes";

let options: ServerOptions = new OptionsBuilder()
    .withName(config.get<string>("server.options.name"))
    .withVersion(config.get<string>("server.options.version"))
    .build();



export let server: Server = new ServerBuilder()
    .withTimeout(config.get<number>("server.options.timeout"))
    .withOptions(options)
    .withRouterList(currentRoutes)
    .withRouterList(stableRoutes)
    .withQueryParser(queryParser())
    .withSecurity(config.get<boolean>("security.enable"))
    .withCORS(false)
    .build();


let port = config.get<number>("port");

server.listen(port, function () {
    LoggerHelper.getDefaultHandler().info("App online on port: " + port);
});