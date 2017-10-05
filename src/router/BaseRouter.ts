import {Server, RequestHandler} from "restify";


export abstract class RouterConfig {
    private _routers: Array<Config> = [];

    constructor() {
    }

    protected get(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.GET, route, callback));
    }

    protected head(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.HEAD, route, callback));
    }

    protected post(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.POST, route, callback));
    }

    protected put(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.PUT, route, callback));
    }

    protected del(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.DELETE, route, callback));
    }

    protected opts(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.OPTIONS, route, callback));
    }

    protected patch(route: any, callback: RequestHandler): void {
        this._routers.push(new Config(HttpVerb.PATCH, route, callback));
    }

    protected abstract onConfig(): void;

    public apply(server: Server): void {

        this.onConfig();

        this._routers.forEach((router: Config) => {

            switch (router.verb) {
                case HttpVerb.GET:
                    server.get(router.route, router.callback);
                    break;
                case HttpVerb.HEAD:
                    server.head(router.route, router.callback);
                    break;
                case HttpVerb.POST:
                    server.post(router.route, router.callback);
                    break;
                case HttpVerb.PUT:
                    server.put(router.route, router.callback);
                    break;
                case HttpVerb.DELETE:
                    server.del(router.route, router.callback);
                    break;
                case HttpVerb.OPTIONS:
                    server.opts(router.route, router.callback);
                    break;
                case HttpVerb.PATCH:
                    server.patch(router.route, router.callback);
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

    constructor(verb: HttpVerb, route: any, callback: RequestHandler) {
        this._verb = verb;
        this._route = route;
        this._callback = callback;
    }

    get verb(): HttpVerb {
        return this._verb;
    }

    get route(): any {
        return this._route;
    }

    get callback(): RequestHandler {
        return this._callback;
    }
}
