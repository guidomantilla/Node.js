"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const models = require("./model/model");
const todos = require("./routes/todos");
const users = require("./routes/users");
exports.app = express();
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use(bodyParser.json());
exports.app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (request.method === "OPTIONS") {
        response.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return response.status(200).json({});
    }
    next();
});
/************************/
exports.app.use("/todos", todos.router);
exports.app.use("/users", users.router);
/************************/
exports.app.use((request, response, next) => {
    const error = new models.TodoAppError("Not Found");
    error.status = 404;
    next(error);
});
exports.app.use((error, request, response, next) => {
    const noRouteError = error;
    response.status(noRouteError.status || 500);
    response.json({
        error: {
            message: noRouteError.message
        }
    });
});
