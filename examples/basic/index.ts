import * as config from "config";

if (config.get<boolean>("newrelic.enable")) {
    require("newrelic");
}

import {queryParser, Server, ServerOptions} from "restify";
import {OptionsBuilder} from "../../src/server/OptionsBuilder";
import {ServerBuilder} from "../../src/server/ServerBuilder";
import {PingRouter} from "../../src/router/PingRouter";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import RouterCurrentBuilder from "./current/RouterCurrentBuilder";

let options: ServerOptions = new OptionsBuilder()
    .withName(config.get<string>("server.options.name"))
    .withVersion(config.get<string>("server.options.version"))
    .build();


const stableRouters = RouterCurrentBuilder.build();
const currentRouters = RouterCurrentBuilder.build();

export let server: Server = new ServerBuilder()
    .withTimeout(config.get<number>("server.options.timeout"))
    .withOptions(options)
    .withRouter(new PingRouter())
    .withRouterList(currentRouters)
    .withRouterList(stableRouters)
    .withQueryParser(queryParser())
    .withSecurity(config.get<boolean>("security.enable"))
    .withCORS(false)
    .build();


// version middleware: default => current
server.pre(function(req, res, next) {
    if (!req.headers["accept-version"]) {
        req.headers["accept-version"] = config.get<string>("server.options.apiVersion.current");
    }
    next();
});

let port = config.get<number>("port");

server.listen(port, function () {
    LoggerHelper.getDefaultHandler().info("App online on port: " + port);
});