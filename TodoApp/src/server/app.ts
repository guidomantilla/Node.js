import * as bodyParser from "body-parser";
import * as express from "express";
import * as core from "express-serve-static-core";

import * as models from "./model/model";
import * as todos from "./routes/todos";
import * as users from "./routes/users";

export const app: core.Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (request.method === "OPTIONS") {
        response.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return response.status(200).json({});
    }
    next();
});

/************************/

app.use("/todos", todos.router);
app.use("/users", users.router);

/************************/

app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
    const error: models.TodoAppError = new models.TodoAppError("Not Found");
    error.status = 404;
    next(error);
});

app.use((error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

    const noRouteError: models.TodoAppError = (error as models.TodoAppError);
    response.status(noRouteError.status || 500);
    response.json({
        error: {
            message: noRouteError.message
        }
    });
});