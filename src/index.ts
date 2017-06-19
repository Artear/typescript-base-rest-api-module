import * as config from "config";

if (config.get<boolean>("newrelic.enable")) {
    require("newrelic");
}

import {queryParser, Server, ServerOptions} from "restify";
import {OptionsBuilder} from "./server/OptionsBuilder";
import {ServerBuilder} from "./server/ServerBuilder";
import {PingRouter} from "./router/PingRouter";
import loggerHelper from "./helper/logger/LoggerHelper";

let options: ServerOptions = new OptionsBuilder()
    .withName(config.get<string>("server.options.name"))
    .withVersion(config.get<string>("server.options.version"))
    .build();

export let server: Server = new ServerBuilder()
    .withTimeout(config.get<number>("server.options.timeout"))
    .withOptions(options)
    .withQueryParser(queryParser())
    .withSecurity(config.get<boolean>("security.enable"))
    .withRouter(new PingRouter())
    .build();

let port = config.get<number>("port");

server.listen(port, function () {
    loggerHelper.info("App online on port: " + port);
});