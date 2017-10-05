import {RouterConfig} from "./BaseRouter";

export class RouterListBuilder {

    _version: string;
    _routers: Array<any>;
    constructor(version: string) {
        this._version = version;
        this._routers = [];
    }

    public withRouter(router: any) {
        this._routers.push(router);
        return this;
    }

    public build() {
        const routers = [];
        this._routers.forEach((router: any) => {
            routers.push(new router(this._version));
        });
        return routers;
    }

}