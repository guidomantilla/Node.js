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
const passwordValidator = require("owasp-password-strength-test");
const validator = require("validator");
const crypto_1 = require("../crypto/crypto");
const users_1 = require("../dao/users");
const authenticate_1 = require("./authenticate");
exports.router = express.Router();
exports.router.post("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.user)) {
            return response.status(400).send("Bad Request: User is empty or is not an Object.");
        }
        const user = lodash.pick(request.body.user, ["email", "password", "tokens"]);
        // Se valida el email
        if (!lodash.isString(user.email)) {
            return response.status(400).send("Bad Request: Email is not a string.");
        }
        user.email = user.email.trim();
        if (user.email.length === 0) {
            return response.status(400).send("Bad Request: Email is empty.");
        }
        if (!validator.isEmail(user.email)) {
            return response.status(400).send("Bad Request: Email is not valid.");
        }
        // Se valida el password
        if (!lodash.isString(user.password)) {
            return response.status(400).send("Bad Request: Password is not a string.");
        }
        user.password = user.password.trim();
        passwordValidator.config({
            allowPassphrases: false,
            maxLength: 10,
            minLength: 6,
            minOptionalTestsToPass: 4,
        });
        const testResult = passwordValidator.test(user.password);
        if (!testResult.strong) {
            return response.status(400).send("Bad Request: " + testResult.errors);
        }
        // Se hace la logica de persistencia
        const usersDAO = new users_1.UsersDAO();
        const userInserted = yield usersDAO.insert(user);
        if (!lodash.isUndefined(userInserted) && !lodash.isUndefined(userInserted._id)) {
            // Se genera el token
            const crypto = new crypto_1.Crypto();
            const token = crypto.generateAuthToken(userInserted._id);
            userInserted.tokens = [];
            userInserted.tokens.push({ access: "auth", token });
            userInserted.password = crypto.hashPassword(userInserted.password);
            const userUpdated = yield usersDAO.update(userInserted);
            response.header("x-auth", token).status(200).send(lodash.pick(userUpdated, ["_id", "email"]));
        }
        else {
            response.status(406).send(`Not Acceptable: User with email ${user.email} already exists`);
        }
    }
    catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.post("/login", (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.user)) {
            return response.status(400).send("Bad Request: User is empty or is not an Object.");
        }
        const user = lodash.pick(request.body.user, ["email", "password"]);
        // Se valida el email
        if (!lodash.isString(user.email)) {
            return response.status(400).send("Bad Request: Email is not a string.");
        }
        user.email = user.email.trim();
        if (user.email.length === 0) {
            return response.status(400).send("Bad Request: Email is empty.");
        }
        if (!validator.isEmail(user.email)) {
            return response.status(400).send("Bad Request: Email is not valid.");
        }
        // Se valida el password
        if (!lodash.isString(user.password)) {
            return response.status(400).send("Bad Request: Password is not a string.");
        }
        user.password = user.password.trim();
        passwordValidator.config({
            allowPassphrases: false,
            maxLength: 10,
            minLength: 6,
            minOptionalTestsToPass: 4,
        });
        const testResult = passwordValidator.test(user.password);
        if (!testResult.strong) {
            return response.status(400).send("Bad Request: " + testResult.errors);
        }
        //
        const usersDAO = new users_1.UsersDAO();
        const userFound = yield usersDAO.selectByEmail(user.email);
        if (!lodash.isNull(userFound) && !lodash.isUndefined(userFound._id)) {
            const crypto = new crypto_1.Crypto();
            const flag = crypto.comparePassword(user.password, userFound.password);
            if (flag) {
                const token = crypto.generateAuthToken(userFound._id);
                userFound.tokens = [];
                userFound.tokens.push({ access: "auth", token });
                const userUpdated = yield usersDAO.update(userFound);
                response.header("x-auth", token).status(200).send(lodash.pick(userUpdated, ["_id", "email"]));
            }
            else {
                response.status(401).send("Unauthorized: Password not valid");
            }
        }
        else {
            response.status(404).send(`Not Found: User with email ${user.email}`);
        }
    }
    catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.delete("/me/token", (request, response) => __awaiter(this, void 0, void 0, function* () {
    // Se valida el objeto
    if (!lodash.isObjectLike(request.body.user)) {
        return response.status(400).send("Bad Request: User is empty or is not an Object.");
    }
    const user = lodash.pick(request.body.user, ["email", "password"]);
    const usersDAO = new users_1.UsersDAO();
    const userFound = yield usersDAO.selectByEmail(user.email);
    if (!lodash.isNull(userFound) && !lodash.isUndefined(userFound._id)) {
        userFound.tokens = [];
        const userUpdated = yield usersDAO.update(userFound);
        response.status(200).send(lodash.pick(userUpdated, ["_id", "email"]));
    }
}));
exports.router.delete("/:id", (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }
        const id = new mongodb_1.ObjectID(request.params.id);
        const usersDAO = new users_1.UsersDAO();
        const deleted = yield usersDAO.delete(id);
        if (deleted) {
            response.status(200).send();
        }
        else {
            response.status(404).send(`Not Found: User with id ${request.params.id}`);
        }
    }
    catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.patch("/:id", (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }
        const id = new mongodb_1.ObjectID(request.params.id);
        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.user)) {
            return response.status(400).send("Bad Request: User is empty or is not an Object.");
        }
        const user = lodash.pick(request.body.user, ["email", "password", "tokens"]);
        user._id = id;
        // Se valida el email
        if (!lodash.isString(user.email)) {
            return response.status(400).send("Bad Request: Email is not a string.");
        }
        user.email = user.email.trim();
        if (user.email.length === 0) {
            return response.status(400).send("Bad Request: Email is empty.");
        }
        if (!validator.isEmail(user.email)) {
            return response.status(400).send("Bad Request: Email is not valid.");
        }
        // Se valida el password
        if (!lodash.isString(user.password)) {
            return response.status(400).send("Bad Request: Password is not a string.");
        }
        user.password = user.password.trim();
        passwordValidator.config({
            allowPassphrases: false,
            maxLength: 10,
            minLength: 6,
            minOptionalTestsToPass: 4,
        });
        const testResult = passwordValidator.test(user.password);
        if (!testResult.strong) {
            return response.status(400).send("Bad Request: " + testResult.errors);
        }
        ///
        const usersDAO = new users_1.UsersDAO();
        const userUpdated = yield usersDAO.update(user);
        if (!lodash.isUndefined(userUpdated)) {
            response.status(200).send(userUpdated);
        }
        else {
            response.status(404).send(`Not Found: User with id ${request.params.id}`);
        }
    }
    catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.get("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        const usersDAO = new users_1.UsersDAO();
        const usersArray = yield usersDAO.selectAll();
        response.status(200).send({ users: usersArray });
    }
    catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.get("/me", authenticate_1.authenticate, (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        response.send(request.body.user);
    }
    catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
exports.router.get("/:id", (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!mongodb_1.ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }
        const id = new mongodb_1.ObjectID(request.params.id);
        const usersDAO = new users_1.UsersDAO();
        const user = yield usersDAO.selectById(id);
        response.status(200).send({ users: user });
    }
    catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
}));
