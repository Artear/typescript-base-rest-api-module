import {ItemRouterCurrent} from "./ItemRouterCurrent";
import * as config from "config";
import {RouterListBuilder} from "../../../src/router/RouterListBuilder";

export default (new RouterListBuilder(config.get<string>("server.options.apiVersion.current")))
                .withRouter(ItemRouterCurrent)
                .build();