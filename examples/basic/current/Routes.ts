import {ItemRouter} from "./ItemRouter";
import {RouterListBuilder} from "../../../src/router/RouterListBuilder";
import {PingRouter} from "../../../src/router/PingRouter";

const _version = require("./version.json");

const RouterBuilder = (new RouterListBuilder(_version.number))
    .withRouter(PingRouter)
    .withRouter(ItemRouter)
    .build();

export default RouterBuilder;