import {ItemRouter} from "./ItemRouter";
import * as config from "config";
import {RouterListBuilder} from "../../../src/router/RouterListBuilder";
import {PingRouter} from "../../../src/router/PingRouter";
import {VersionRouter} from "../../../src/router/VersionRouter";

const RouterBuilder = (new RouterListBuilder(config.get<string>("server.options.apiVersion.current")))
    .withRouter(PingRouter)
    .withRouter(ItemRouter)
    .withRouter(VersionRouter)
    .build();

export default RouterBuilder;