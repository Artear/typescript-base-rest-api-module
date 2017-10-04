import * as config from "config";

if (config.get<boolean>("newrelic.enable")) {
    require("newrelic");
}

import {queryParser, Server, ServerOptions} from "restify";
import {OptionsBuilder} from "../../src/server/OptionsBuilder";
import {ServerBuilder} from "../../src/server/ServerBuilder";
import {PingRouter} from "../../src/router/PingRouter";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import {ItemRouter} from "./latest/ItemRouter";
import {ItemRouterStable} from "./stable/ItemRouterStable";
import RouterStableBuilder from "./latest/RouterStableBuilder";

let options: ServerOptions = new OptionsBuilder()
    .withName(config.get<string>("server.options.name"))
    .withVersion(config.get<string>("server.options.version"))
    .build();


const latest_routers = RouterStableBuilder.build();
const stable_routers = RouterLatestBuilder.build();

const crazy_routers = RouterCrazyBuilder.build();

let server: Server = new ServerBuilder()
    .withTimeout(config.get<number>("server.options.timeout"))
    .withOptions(options)
    .withRouterList(latest_routers)
    .withRouterList(stable_routers)
    .withQueryParser(queryParser())
    .withSecurity(config.get<boolean>("security.enable"))
    .withCORS(false)
    .build();


// version middleware: default => latest
server.pre(function(req, res, next) {
    if (!req.headers['accept-version']) {
        req.headers['accept-version'] = '1.0';
    }
    next();
});

let port = config.get<number>("port");

server.listen(port, function () {
    LoggerHelper.getDefaultHandler().info("App online on port: " + port);
});