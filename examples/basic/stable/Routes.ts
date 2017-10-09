import {ItemRouter} from "./ItemRouter";
import * as config from "config";
import {RouterListBuilder} from "../../../src/router/RouterListBuilder";
import {PingRouter} from "../../../src/router/PingRouter";

const RouterBuilder = (new RouterListBuilder(config.get<string>("server.options.apiVersion.stable")))
    .withRouter(PingRouter)
    .withRouter(ItemRouter)
    .build();

export default RouterBuilder;