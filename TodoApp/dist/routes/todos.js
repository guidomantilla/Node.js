"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const lodash = require("lodash");
const mongodb_1 = require("mongodb");
const todos_1 = require("../dao/todos");
const authenticate_1 = require("./authenticate");
exports.router = express.Router();
exports.router.post("/", authenticate_1.authenticate, (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.todo)) {
            return response.status(400).send("Bad Request: Todo is empty or is not an Object.");
        }
        const todo = request.body.todo;
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
        const todosDAO = new todos_1.TodosDAO();
        const todoInserted = yield todosDAO.insert(todo);
        if (!lodash.isUndefined(todoInserted) && !lodash.isUndefined(todoInserted._id)) {
            response.status(200).send(todoInserted);
        }
        else {
            response.status(406).send(`Not Acceptable: Todo with id ${todo._id} already exists`);
        }
    }
    catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.delete("/:id", authenticate_1.authenticate, (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }
        const id = new mongodb_1.ObjectID(request.params.id);
        const creator = request.body.user._id;
        const todosDAO = new todos_1.TodosDAO();
        const deleted = yield todosDAO.deleteByCreator(id, creator);
        if (deleted) {
            response.status(200).send();
        }
        else {
            response.status(404).send(`Not Found: Todo with id ${request.params.id}`);
        }
    }
    catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.patch("/:id", authenticate_1.authenticate, (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectID.isValid(request.params.id)) {
            response.status(400).send("Bad Request: ObjectID is not valid.");
        }
        const id = new mongodb_1.ObjectID(request.params.id);
        const creator = request.body.user._id;
        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.todo)) {
            return response.status(400).send("Bad Request: Todo is empty or is not an Object.");
        }
        const todo = request.body.todo;
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
        const todosDAO = new todos_1.TodosDAO();
        const todoUpdated = yield todosDAO.updateCreator(todo);
        if (!lodash.isUndefined(todoUpdated)) {
            response.status(200).send(todoUpdated);
        }
        else {
            response.status(404).send(`Not Found: Todo with id ${request.params.id}`);
        }
    }
    catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.get("/", authenticate_1.authenticate, (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        const creator = request.body.user._id;
        const todosDAO = new todos_1.TodosDAO();
        const todosArray = yield todosDAO.selectByCreator(creator);
        response.status(200).send({ todos: todosArray });
    }
    catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.get("/:id", authenticate_1.authenticate, (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }
        const id = new mongodb_1.ObjectID(request.params.id);
        const creator = request.body.user._id;
        const todosDAO = new todos_1.TodosDAO();
        const todo = yield todosDAO.selectByIdCreator(id, creator);
        response.status(200).send({ todos: todo });
    }
    catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
