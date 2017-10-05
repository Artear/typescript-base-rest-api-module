import {RouterConfig} from "../../../src/router/BaseRouter";
import {ItemRouterCurrent} from "./ItemRouterCurrent";
import * as config from "config";

export default class RouterCurrentBuilder {

    public static build(): Array<RouterConfig> {
        const version = config.get<string>("server.options.apiVersion.current");
        return [
            new ItemRouterCurrent(version)
        ];
    }

}