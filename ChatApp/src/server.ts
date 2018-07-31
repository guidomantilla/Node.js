import * as bodyParser from "body-parser";
import * as express from "express";
import { Express, NextFunction, Request, Response } from "express";
import * as filesystem from "fs";
import * as handlebars from "handlebars";
import * as http from "http";
import { Server } from "http";
import * as path from "path";
import * as socketIO from "socket.io";

import { Events } from "./events/events";
import { ChatAppError } from "./model/models";

const app: Express = express();
const port: string | number = process.env.PORT || 3000;
const server: Server = http.createServer(app);
const events: Events = new Events(server);

/************************/

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request: Request, response: Response, next: NextFunction) => {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (request.method === "OPTIONS") {
        response.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return response.status(200).json({});
    }
    next();
});

/************************/

events.onConnection();

/************************/

app.use((request: Request, response: Response, next: NextFunction) => {
    const error: ChatAppError = new ChatAppError("Not Found");
    error.status = 404;
    next(error);
});

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {

    const noRouteError: ChatAppError = (error as ChatAppError);
    response.status(noRouteError.status || 500);
    response.json({
        error: {
            message: noRouteError.message
        }
    });
});

/************************/

server.listen(port);