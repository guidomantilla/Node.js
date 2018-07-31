import * as express from "express";
import * as lodash from "lodash";
import { ObjectID } from "mongodb";
import * as passwordValidator from "owasp-password-strength-test";
import * as validator from "validator";
import { Crypto } from "../crypto/crypto";
import { TodosDAO } from "../dao/todos";
import { Todo } from "../model/model";
import { authenticate } from "./authenticate";

export const router = express.Router();

router.post("/", authenticate, async (request: express.Request, response: express.Response) => {

    try {

        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.todo)) {
            return response.status(400).send("Bad Request: Todo is empty or is not an Object.");
        }

        const todo: Todo = request.body.todo;

        // Se valida el text
        if (!lodash.isString(todo.text)) {
            return response.status(400).send("Bad Request: Text is not a string.");
        }

        todo.text = todo.text.trim();
        if (todo.text.length === 0) {
            return response.status(400).send("Bad Request: Text is empty.");
        }

        // Se valida el completed
        if (!lodash.isBoolean(todo.completed)) {
            todo.completed = false;
        }

        // Se valida el _creator
        todo._creator = request.body.user._id;

        // Logica de negocio
        const todosDAO: TodosDAO = new TodosDAO();
        const todoInserted: Todo | undefined = await todosDAO.insert(todo);

        if (!lodash.isUndefined(todoInserted) && !lodash.isUndefined(todoInserted._id)) {
            response.status(200).send(todoInserted);
        } else {
            response.status(406).send(`Not Acceptable: Todo with id ${todo._id} already exists`);
        }
    } catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.delete("/:id", authenticate, async (request: express.Request, response: express.Response) => {

    try {

        if (!ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }

        const id: ObjectID = new ObjectID(request.params.id);
        const creator: ObjectID = request.body.user._id;

        const todosDAO: TodosDAO = new TodosDAO();
        const deleted: boolean = await todosDAO.deleteByCreator(id, creator);
        if (deleted) {
            response.status(200).send();
        } else {
            response.status(404).send(`Not Found: Todo with id ${request.params.id}`);
        }

    } catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.patch("/:id", authenticate, async (request: express.Request, response: express.Response) => {

    try {

        if (!ObjectID.isValid(request.params.id)) {
            response.status(400).send("Bad Request: ObjectID is not valid.");
        }

        const id: ObjectID = new ObjectID(request.params.id);
        const creator: ObjectID = request.body.user._id;

        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.todo)) {
            return response.status(400).send("Bad Request: Todo is empty or is not an Object.");
        }

        const todo: Todo = request.body.todo;
        todo._id = id;

        // Se valida el text
        if (!lodash.isString(todo.text)) {
            return response.status(400).send("Bad Request: Text is not a string.");
        }

        todo.text = todo.text.trim();
        if (todo.text.length === 0) {
            return response.status(400).send("Bad Request: Text is empty.");
        }

        // Se valida el completed
        if (!lodash.isBoolean(todo.completed)) {
            todo.completed = false;
        }

        // Se valida el _creator
        todo._creator = creator;

        const todosDAO: TodosDAO = new TodosDAO();
        const todoUpdated: Todo | undefined = await todosDAO.updateCreator(todo);

        if (!lodash.isUndefined(todoUpdated)) {
            response.status(200).send(todoUpdated);
        } else {
            response.status(404).send(`Not Found: Todo with id ${request.params.id}`);
        }

    } catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.get("/", authenticate, async (request: express.Request, response: express.Response) => {

    try {

        const creator: ObjectID = request.body.user._id;

        const todosDAO: TodosDAO = new TodosDAO();
        const todosArray = await todosDAO.selectByCreator(creator);
        response.status(200).send({ todos: todosArray });

    } catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.get("/:id", authenticate, async (request: express.Request, response: express.Response) => {

    try {

        if (!ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }

        const id: ObjectID = new ObjectID(request.params.id);
        const creator: ObjectID = request.body.user._id;

        const todosDAO: TodosDAO = new TodosDAO();
        const todo = await todosDAO.selectByIdCreator(id, creator);
        response.status(200).send({ todos: todo });

    } catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

