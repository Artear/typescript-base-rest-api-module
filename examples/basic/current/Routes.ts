import {ItemRouter} from "./ItemRouter";
import {RouterListBuilder} from "../../../src/router/RouterListBuilder";
import {PingRouter} from "../../../src/router/PingRouter";
import {VersionRouter} from "../../../src/router/VersionRouter";

const _version = require("./version.json");

const RouterBuilder = (new RouterListBuilder(_version.number))
    .withRouter(PingRouter)
    .withRouter(ItemRouter)
    .withRouter(VersionRouter)
    .build();

export default RouterBuilder;