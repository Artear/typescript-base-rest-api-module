import {RequestHandler} from "restify";
import {ServerRouterConfig} from "../server/ServerRouterConfig";


export abstract class RouterConfig {
    private _routers: Array<RouterConfigItem> = [];
    private _version: any;

    constructor(version?: any) {
        this._version = version;
    }

    protected get(route: any, callback: RequestHandler): void {
        this._routers.push(new RouterConfigItem(HttpVerb.GET, route, callback, this._version));
    }

    protected head(route: any, callback: RequestHandler): void {
        this._routers.push(new RouterConfigItem(HttpVerb.HEAD, route, callback, this._version));
    }

    protected post(route: any, callback: RequestHandler): void {
        this._routers.push(new RouterConfigItem(HttpVerb.POST, route, callback, this._version));
    }

    protected put(route: any, callback: RequestHandler): void {
        this._routers.push(new RouterConfigItem(HttpVerb.PUT, route, callback, this._version));
    }

    protected del(route: any, callback: RequestHandler): void {
        this._routers.push(new RouterConfigItem(HttpVerb.DELETE, route, callback, this._version));
    }

    protected opts(route: any, callback: RequestHandler): void {
        this._routers.push(new RouterConfigItem(HttpVerb.OPTIONS, route, callback, this._version));
    }

    protected patch(route: any, callback: RequestHandler): void {
        this._routers.push(new RouterConfigItem(HttpVerb.PATCH, route, callback, this._version));
    }

    protected abstract onConfig(): void;

    public apply(serverRouterConfig: ServerRouterConfig): void {

        this.onConfig();

        this._routers.forEach((router: RouterConfigItem) => {
            switch (router.verb) {
                case HttpVerb.GET:
                    serverRouterConfig.addGetRoute(router);
                    break;
                case HttpVerb.HEAD:
                    serverRouterConfig.addHeadRoute(router);
                    break;
                case HttpVerb.POST:
                    serverRouterConfig.addPostRoute(router);
                    break;
                case HttpVerb.PUT:
                    serverRouterConfig.addPutRoute(router);
                    break;
                case HttpVerb.DELETE:
                    serverRouterConfig.addDeleteRoute(router);
                    break;
                case HttpVerb.OPTIONS:
                    serverRouterConfig.addOptionsRoute(router);
                    break;
                case HttpVerb.PATCH:
                    serverRouterConfig.addPatchRoute(router);
                    break;
            }

        });
    }
}


export enum HttpVerb {
    GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH
}

export class RouterConfigItem {
    private _verb: HttpVerb;
    private _route: any;
    private _callback: RequestHandler;
    private _version: any;

    constructor(verb: HttpVerb, route: any, callback: RequestHandler, version?: any) {
        this._verb = verb;
        this._route = route;
        this._callback = callback;
        this._version = version;
    }

    get verb(): HttpVerb {
        return this._verb;
    }

    get version(): any {
        return this._version;
    }

    get route(): any {
        return this._route;
    }

    get callback(): RequestHandler {
        return this._callback;
    }
}
