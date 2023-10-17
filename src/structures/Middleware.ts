import { APIError } from "../utils/index";
import { Response, Request, NextFunction } from "express";
import { Memory } from "./point";

type MiddlewareAction = (options: MiddlewareActionProps) => any;

interface MiddlewareActionProps {
  response: Response;
  request: Request;
  next: NextFunction;
  cache: Memory<string, any>;
}

interface MiddlewareOptions {
  name: string;
  route: string;
  action?: MiddlewareAction;
}

export class Middleware {
    readonly name: string;
    readonly route: string;
    readonly action?: MiddlewareAction;

    constructor(options: MiddlewareOptions) {
        let { name, route, action } = options;
        
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
            }
        });
    }
}