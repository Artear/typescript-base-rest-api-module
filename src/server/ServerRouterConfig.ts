import {RouterConfigItem} from "../router/BaseRouter";
import {Server} from "restify";
import * as restify from "restify";

export class ServerRouterConfig {
    private _get: Array<RouterConfigItem>;
    private _head: Array<RouterConfigItem>;
    private _post: Array<RouterConfigItem>;
    private _put: Array<RouterConfigItem>;
    private _delete: Array<RouterConfigItem>;
    private _options: Array<RouterConfigItem>;
    private _patch: Array<RouterConfigItem>;

    constructor() {
        this._get = [];
        this._head = [];
        this._post = [];
        this._put = [];
        this._delete = [];
        this._options = [];
        this._patch = [];
    }

    public addGetRoute(config: RouterConfigItem) {
        this._get.push(config);
    }

    public addHeadRoute(config: RouterConfigItem) {
        this._head.push(config);
    }

    public addPostRoute(config: RouterConfigItem) {
        this._post.push(config);
    }

    public addPutRoute(config: RouterConfigItem) {
        this._put.push(config);
    }

    public addDeleteRoute(config: RouterConfigItem) {
        this._delete.push(config);
    }

    public addOptionsRoute(config: RouterConfigItem) {
        this._options.push(config);
    }

    public addPatchRoute(config: RouterConfigItem) {
        this._patch.push(config);
    }

    private _mergeRoutes(prev, current) {
        const found = prev.find((el) => el.path === current.route);
        if (found) {
            found.handlers.push({version: current.version, handler: current.callback});
            return prev;
        } else {
            return [...prev, {path: current.route, handlers: [{version: current.version, handler: current.callback}]}];
        }
    }

    public apply(server: Server) {
        this._get.reduce(this._mergeRoutes, [])
            .forEach((route) => server.get(route.path, restify.plugins.conditionalHandler(route.handlers)));

        this._head.reduce(this._mergeRoutes, [])
            .forEach((route) => server.head(route.path, restify.plugins.conditionalHandler(route.handlers)));

        this._post.reduce(this._mergeRoutes, [])
            .forEach((route) => server.post(route.path, restify.plugins.conditionalHandler(route.handlers)));

        this._put.reduce(this._mergeRoutes, [])
            .forEach((route) => server.put(route.path, restify.plugins.conditionalHandler(route.handlers)));

        this._delete.reduce(this._mergeRoutes, [])
            .forEach((route) => server.del(route.path, restify.plugins.conditionalHandler(route.handlers)));

        this._options.reduce(this._mergeRoutes, [])
            .forEach((route) => server.opts(route.path, restify.plugins.conditionalHandler(route.handlers)));

        this._patch.reduce(this._mergeRoutes, [])
            .forEach((route) => server.patch(route.path, restify.plugins.conditionalHandler(route.handlers)));
    }
}
