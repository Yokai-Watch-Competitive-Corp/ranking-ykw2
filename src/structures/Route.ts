import {Response, Request} from 'express'
import { Memory } from './point';
import { APIError } from "../utils/index";

type RouteAction = (options: RouteActionProps) => any;
type types = 'get' | 'post' | 'put' | 'delete';

interface RouteActionProps {
    response: Response;
    request: Request;
    cache: Memory<string, any>
}

interface RouteOptions {
    name: string;
    route: string;
    action?: RouteAction;
    type?: types; 
}

export class Route {
    readonly name: string;
    readonly route: string;
    readonly action?: RouteAction;
    readonly type?: types;

    constructor(options: RouteOptions) {
        let {name, route, action, type} = options;
        
        Object.defineProperties(this, {
            name: {
                writable: false,
                enumerable: true,
                value: name
            },
            route: {
                writable: false,
                enumerable: true,
                value: route
            },
            action: {
                writable: false,
                enumerable: true,
                value: action ?? (() => {})
            },
            type: {
                writable: false,
                enumerable: true,
                value: type ?? "get"
            }
        });
    }
}