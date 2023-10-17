import handleObjects from "../utils/handleObjects";
import express, { Express } from 'express';
import { APIError } from '../utils/index';
import { Memory, Plugin, Middleware, Route } from './point';
const SetValue = (value: any, isenum?: boolean) => {return {writable: false, enumerable: isenum ?? true, value}};
import * as basePlug from '../plugins/point';

type Plugins = {
    [k: string]: Plugin<boolean>;
}
type Middlewares = {
    [k: string]: Middleware;
}
type Routes = {
    [k: string]: Route;
}

interface APIOptions {
    routes?: Routes;
    middleware?: Middlewares;
    plugins?: Plugins;
    app?: Express;
    enableBody?: boolean;
}

interface ConnectOptions {
    routes: EnableRoutesOptions;
    middleware: EnableMiddlewareOptions;
    callback: (app: Express) => any;
}

interface EnableRoutesOptions {
    exclude?: Array<string>;
    routes?: Routes;
}

interface EnableMiddlewareOptions {
    exclude?: Array<string>;
    middleware?: Middlewares;
}

export class API {
    readonly routes: Memory<string, Route>;
    readonly App: Express;
    readonly middleware: Memory<string, Middleware>
    readonly plugins: Memory<string, Plugin<boolean>>;
    readonly enableBody: boolean;
    readonly cache: Memory<string, any>

    constructor(options?: APIOptions) {
        let {routes, middleware, plugins, app, enableBody} = options;

        Object.defineProperties(this, {
            routes: SetValue(handleObjects({objects: routes}) ?? new Memory()),
            middleware: SetValue(handleObjects({objects: middleware}) ?? new Memory()),
            plugins: SetValue(handleObjects({objects: Object.assign(basePlug, plugins)}) ?? handleObjects({objects: basePlug})),
            enableBody: SetValue(enableBody ? true : false),
            App: SetValue(app ?? express()),
            cache: SetValue(new Memory(), false)
        });

        if (this.enableBody) this.App.use(express.json());
    }

    // TODO: add path option
    private enableRoutes(options: EnableRoutesOptions) {
        let { exclude = [], routes = {} } = options;

        if (routes) Object.defineProperty(
            this, "routes", SetValue(handleObjects({objects: routes, storage: this.routes}))
        );

        for (let {name, route, action, type} of this.routes.values()) {
            if (exclude.includes(name) || exclude.includes(route)) continue;

            this.App[type](
                route,
                (request, response) => action({request, response, cache: this.cache})
            );
        }

        return this;
    }

    // TODO: add path option
    private enableMiddleware({exclude = [], middleware = {}} = {}) {
        if (middleware) Object.defineProperty(
            this, "middleware", SetValue(handleObjects({objects: middleware, storage: this.middleware}))
        );
        
        for (let {name, route, action} of this.middleware.values()) {
            if (exclude.includes(name) || exclude.includes(route)) {continue};

            this.App.use(
                route,
                (request, response, next) => action({request, response, next, cache: this.cache})
            );
        }

        return this;
    }

    connect(port: number, options: ConnectOptions) {
        let {routes, middleware, callback} = options;

        this.enableMiddleware(middleware).enableRoutes(routes);
        this.App.listen(port, callback(this.App));
    }
}