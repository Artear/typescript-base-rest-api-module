import {RouterConfig} from "../router/BaseRouter";
import * as restify from "restify";
import {RequestHandler, Server, ServerOptions} from "restify";
import {NotAuthorizedError} from "restify-errors";
import serverCharset from "./ServerCharset";
import * as config from "config";
import * as corsMiddleware from "restify-cors-middleware";
import {ServerRouterConfig} from "./ServerRouterConfig";

const yn = require("yn");

const queryParser = restify.plugins.queryParser({
    mapParams: true
});

export class ServerBuilder {

    private _serverOptions: ServerOptions;
    private _routerConfig: Array<RouterConfig>;
    private _routerConfigBuilder: ServerRouterConfig;
    private _sanitizer: RequestHandler;
    private _queryParser: RequestHandler;
    private _charset: RequestHandler;
    private _bodyParser: RequestHandler;
    private _timeout: number;
    private _security: boolean;
    private _cors: boolean;

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
    }

    public withQueryParser(queryParser: RequestHandler) {
        this._queryParser = queryParser;
        return this;
    }

    public withCharset(charset: RequestHandler) {
        this._charset = charset;
    }

    public withBodyParser(bodyParser: RequestHandler) {
        this._bodyParser = bodyParser;
    }

    public withTimeout(timeout: number): ServerBuilder {
        this._timeout = timeout;
        return this;
    }

    public withCORS(enable: boolean): ServerBuilder {
        this._cors = enable;
        return this;
    }

    public build(): Server {
        let server = restify.createServer(this._serverOptions);

        if (!!this._bodyParser) {
            server.use(this._bodyParser);
        } else {
            server.use(queryParser);
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
            server.use((req, res, next) => {

                switch (req.method) {
                    case "POST":
                    case "PUT":
                    case "DELETE":
                    case "PATCH":
                        let token = req.headers["authorization"];
                        if (!(!!token && config.get<string>("security.token") === token)) {
                            return res.send(new NotAuthorizedError("invalid Token"));
                        }
                        break;
                }

                next();
            });
        }

        if (this._cors) {
            server.use(corsMiddleware({"origins": ["*"]}));
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
