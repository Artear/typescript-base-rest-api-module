import {ItemRouter} from "./ItemRouter";
import * as config from "config";
import {RouterListBuilder} from "../../../src/router/RouterListBuilder";

const RouterBuilder = (new RouterListBuilder(config.get<string>("server.options.apiVersion.current")))
                .withRouter(ItemRouter)
                .build();

export default RouterBuilder;