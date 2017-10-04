
import {RouterConfig} from "../../../src/router/BaseRouter";
import {ItemRouterStable} from "../stable/ItemRouterStable";

export default class RouterStableBuilder {

    public static build(): Array<RouterConfig> {
        const stable = config.version.stable = '1.0.0'
        return [new ItemRouterStable(stable)];
    }

}