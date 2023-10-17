import { API, Route, Middleware } from "../structures/point";

const app = new API({});

app.connect(0, {
    callback: () => console.log("hola"),
    routes: {
        routes: {
            get: new Route({
                name: "helloworld",
                route: "/check/hola"
            })
        }
    },
    middleware: {
        middleware: {
            get_check: new Middleware({
                name: "get_check",
                route: "/check"
            })
        }
    }
});