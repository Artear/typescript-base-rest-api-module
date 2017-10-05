import * as config from "config";

if (config.get<boolean>("newrelic.enable")) {
    require("newrelic");
}

import {queryParser, Server, ServerOptions} from "restify";
import {OptionsBuilder} from "../../src/server/OptionsBuilder";
import {ServerBuilder} from "../../src/server/ServerBuilder";
import {PingRouter} from "../../src/router/PingRouter";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import currentRoutes from "./current/Routes";

let options: ServerOptions = new OptionsBuilder()
    .withName(config.get<string>("server.options.name"))
    .withVersion(config.get<string>("server.options.version"))
    .build();



export let server: Server = new ServerBuilder()
    .withTimeout(config.get<number>("server.options.timeout"))
    .withOptions(options)
    .withRouter(new PingRouter())
    .withRouterList(currentRoutes)
    .withQueryParser(queryParser())
    .withSecurity(config.get<boolean>("security.enable"))
    .withCORS(false)
    .build();


let port = config.get<number>("port");

server.listen(port, function () {
    LoggerHelper.getDefaultHandler().info("App online on port: " + port);
});