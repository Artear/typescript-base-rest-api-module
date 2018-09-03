import {RouterConfig} from "../router/BaseRouter";
import * as restify from "restify";
import {RequestHandler, Server, ServerOptions} from "restify";
import { securityMiddleware } from "./SecurityMiddleware";
import serverCharset from "./ServerCharset";
import * as config from "config";
import * as corsMiddleware from "restify-cors-middleware";
import {ServerRouterConfig} from "./ServerRouterConfig";

const yn = require("yn");

const queryParser = restify.plugins.queryParser({
    mapParams: true
});

const bodyParser = restify.plugins.bodyParser({
    mapParams: true
});

export class ServerBuilder {

    private _serverOptions: ServerOptions;
    private _routerConfig: Array<RouterConfig>;
    private _routerConfigBuilder: ServerRouterConfig;
    private _sanitizer: RequestHandler;
    private _queryParser: RequestHandler;
    private _charset: RequestHandler;
    private _bodyParser: RequestHandler[];
    private _timeout: number;
    private _security: boolean;
    private _cors: boolean;
    private _middlewares: RequestHandler[];
    private _uncaughtExceptionHandler: any;

    constructor(routerConfigBuilder: ServerRouterConfig) {
        this._serverOptions = {};
        this._routerConfig = [];
        this._routerConfigBuilder = routerConfigBuilder;
        this._sanitizer = null;
        this._queryParser = null;
        this._charset = null;
        this._bodyParser = null;
        this._timeout = null;
        this._security = false;
        this._cors = true;
        this._middlewares = [];
        this._uncaughtExceptionHandler = null;
    }

    public withOptions(serverOptions: ServerOptions): ServerBuilder {
        this._serverOptions = serverOptions;
        return this;
    }

    public withSecurity(security: boolean): ServerBuilder {
        this._security = security;
        return this;
    }

    public withRouter(routerConfig: RouterConfig): ServerBuilder {
        this._routerConfig.push(routerConfig);
        return this;
    }

    public withRouterList(routerList: Array<RouterConfig>): ServerBuilder {
        routerList.map(router => this._routerConfig.push(router));
        return this;
    }

    public withSanitizer(sanitizer: RequestHandler) {
        this._sanitizer = sanitizer;
        return this;
    }

    public withQueryParser(queryParser: RequestHandler) {
        console.warn("restify's queryParser is designed to retrieve data from a url's query string. If you " +
            "are attempting to read post data from the request's body, please use the bodyParser plugin and the " +
            "method withBodyParser instead.");
        this._queryParser = queryParser;
        return this;
    }

    public withCharset(charset: RequestHandler) {
        this._charset = charset;
        return this;
    }

    public withBodyParser(bodyParser: RequestHandler[]) {
        this._bodyParser = bodyParser;
        return this;
    }

    public withTimeout(timeout: number): ServerBuilder {
        this._timeout = timeout;
        return this;
    }

    public withCORS(enable: boolean): ServerBuilder {
        this._cors = enable;
        return this;
    }

    public withMiddleWare(component) {
        this._middlewares.push(component);
        return this;
    }


    public withUncaughtExceptionHandler(handler: any): ServerBuilder {
        this._uncaughtExceptionHandler = handler;
        return this;
    }

    public withBugsnag() {
        if (config.get<boolean>("bugsnag.enable")) {
            const bugsnag = require("bugsnag");
            bugsnag.register(config.get<string>("bugsnag.api_key"), {
                releaseStage: config.get<string>("bugsnag.release_stage")
            });
            this.withUncaughtExceptionHandler(bugsnag.restifyHandler);
        }
        return this;
    }

    public withMorgan() {
        const morgan = require("morgan");
        this.withMiddleWare(morgan(config.get<string>("morgan.format")));
        return this;
    }

    public build(): Server {
        let server = restify.createServer(this._serverOptions);

        if (!!this._bodyParser) {
            server.use(this._bodyParser);
        } else {
            server.use(bodyParser);
        }

        if (!!this._charset) {
            server.pre(this._charset);
        } else {
            server.pre(serverCharset);
        }

        if (!!this._queryParser) {
            server.use(this._queryParser);
        } else {
            server.use(queryParser);
        }

        if (!!this._sanitizer) {
            server.pre(this._sanitizer);
        } else {
            server.pre(restify.pre.sanitizePath());
        }

        if (!!this._timeout) {
            let timeout = this._timeout;
            server.use(function (req, res, next) {
                req.connection.setTimeout(timeout);
                next();
            });
        }

        if (yn(this._security)) {
            server.use(securityMiddleware);
        }

        if (this._cors) {
            const cors = corsMiddleware({"origins": ["*"]});
            server.pre(cors.preflight);
            server.use(cors.actual);
        }

        if (this._middlewares.length > 0) {
            for (const _middleware in this._middlewares) {
                if (this._middlewares.hasOwnProperty(_middleware)) {
                    server.use(this._middlewares[_middleware]);
                }
            }
        }

        if (this._uncaughtExceptionHandler) {
            server.on("uncaughtException", this._uncaughtExceptionHandler);
        }

        this._routerConfig.forEach((config: RouterConfig) => {
            config.apply(this._routerConfigBuilder);
        });
        this._routerConfigBuilder.apply(server);

        server.pre(function (req, res, next) {
            if (!req.headers["accept-version"]) {
                req.headers["accept-version"] = config.get<string>("server.options.defaultApiVersion");
            }
            next();
        });

        return server;
    }

}
