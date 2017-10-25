const version = require("../version.json");
import {PingRouter, RouterListBuilder} from "typescript_base_rest_api";

export default (new RouterListBuilder(version.number))
    .withRouter(PingRouter)
    .build();