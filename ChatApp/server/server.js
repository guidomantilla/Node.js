"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const path = require("path");
const events_1 = require("./events/events");
const models_1 = require("./model/models");
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const events = new events_1.Events(server);
/************************/
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((request, response, next) => {
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
app.use((request, response, next) => {
    const error = new models_1.ChatAppError("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, request, response, next) => {
    const noRouteError = error;
    response.status(noRouteError.status || 500);
    response.json({
        error: {
            message: noRouteError.message
        }
    });
});
/************************/
server.listen(port);
