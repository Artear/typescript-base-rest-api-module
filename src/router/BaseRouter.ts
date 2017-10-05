import {Server, RequestHandler} from "restify";


export abstract class RouterConfig {
    private _routers: Array<Config> = [];
    private _version: any;

    constructor(version?: any) {
        this._version = version;
    }

    protected get(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.GET, route, callback, this._version));
    }

    protected head(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.HEAD, route, callback, this._version));
    }

    protected post(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.POST, route, callback, this._version));
    }

    protected put(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.PUT, route, callback, this._version));
    }

    protected del(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.DELETE, route, callback, this._version));
    }

    protected opts(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.OPTIONS, route, callback, this._version));
    }

    protected patch(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.PATCH, route, callback, this._version));
    }

    protected abstract onConfig(): void;

    public apply(server: Server): void {

        this.onConfig();

        this._routers.forEach((router: Config) => {

            switch (router.verb) {
                case HttpVerb.GET:
                    server.get({path: router.route, version: router.version }, router.callback);
                    break;
                case HttpVerb.HEAD:
                    server.head({path: router.route, version: router.version }, router.callback);
                    break;
                case HttpVerb.POST:
                    server.post({path: router.route, version: router.version }, router.callback);
                    break;
                case HttpVerb.PUT:
                    server.put({path: router.route, version: router.version }, router.callback);
                    break;
                case HttpVerb.DELETE:
                    server.del({path: router.route, version: router.version }, router.callback);
                    break;
                case HttpVerb.OPTIONS:
                    server.opts({path: router.route, version: router.version }, router.callback);
                    break;
                case HttpVerb.PATCH:
                    server.patch({path: router.route, version: router.version }, router.callback);
                    break;
            }

        });
    }
}


enum HttpVerb {
    GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH
}

class Config {
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
