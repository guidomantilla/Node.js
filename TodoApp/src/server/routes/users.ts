import * as express from "express";
import * as lodash from "lodash";
import { ObjectID } from "mongodb";
import * as passwordValidator from "owasp-password-strength-test";
import * as validator from "validator";
import { Crypto } from "../crypto/crypto";
import { UsersDAO } from "../dao/users";
import { Token, User } from "../model/model";
import { authenticate } from "./authenticate";

export const router = express.Router();

router.post("/", async (request: express.Request, response: express.Response) => {

    try {

        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.user)) {
            return response.status(400).send("Bad Request: User is empty or is not an Object.");
        }
        const user: User = lodash.pick(request.body.user, ["email", "password", "tokens"]);

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
        const usersDAO: UsersDAO = new UsersDAO();
        const userInserted: User | undefined = await usersDAO.insert(user);

        if (!lodash.isUndefined(userInserted) && !lodash.isUndefined(userInserted._id)) {

            // Se genera el token
            const crypto: Crypto = new Crypto();
            const token: string = crypto.generateAuthToken(userInserted._id);

            userInserted.tokens = [];
            userInserted.tokens.push({ access: "auth", token });

            userInserted.password = crypto.hashPassword(userInserted.password);

            const userUpdated = await usersDAO.update(userInserted);
            response.header("x-auth", token).status(200).send(lodash.pick(userUpdated, ["_id", "email"]));


        } else {
            response.status(406).send(`Not Acceptable: User with email ${user.email} already exists`);
        }

    } catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.post("/login", async (request: express.Request, response: express.Response) => {

    try {

        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.user)) {
            return response.status(400).send("Bad Request: User is empty or is not an Object.");
        }
        const user: User = lodash.pick(request.body.user, ["email", "password"]);

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
        const usersDAO: UsersDAO = new UsersDAO();
        const userFound: User = await usersDAO.selectByEmail(user.email);

        if (!lodash.isNull(userFound) && !lodash.isUndefined(userFound._id)) {

            const crypto: Crypto = new Crypto();
            const flag: boolean = crypto.comparePassword(user.password, userFound.password);

            if (flag) {

                const token: string = crypto.generateAuthToken(userFound._id);

                userFound.tokens = [];
                userFound.tokens.push({ access: "auth", token });

                const userUpdated = await usersDAO.update(userFound);
                response.header("x-auth", token).status(200).send(lodash.pick(userUpdated, ["_id", "email"]));

            } else {
                response.status(401).send("Unauthorized: Password not valid");
            }
        } else {
            response.status(404).send(`Not Found: User with email ${user.email}`);
        }

    } catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.delete("/me/token", async (request: express.Request, response: express.Response) => {

    // Se valida el objeto
    if (!lodash.isObjectLike(request.body.user)) {
        return response.status(400).send("Bad Request: User is empty or is not an Object.");
    }
    const user: User = lodash.pick(request.body.user, ["email", "password"]);

    const usersDAO: UsersDAO = new UsersDAO();
    const userFound: User = await usersDAO.selectByEmail(user.email);

    if (!lodash.isNull(userFound) && !lodash.isUndefined(userFound._id)) {

        userFound.tokens = [];
        const userUpdated = await usersDAO.update(userFound);
        response.status(200).send(lodash.pick(userUpdated, ["_id", "email"]));
    }

});

router.delete("/:id", async (request: express.Request, response: express.Response) => {

    try {

        if (!ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }

        const id: ObjectID = new ObjectID(request.params.id);

        const usersDAO: UsersDAO = new UsersDAO();
        const deleted: boolean = await usersDAO.delete(id);
        if (deleted) {
            response.status(200).send();
        } else {
            response.status(404).send(`Not Found: User with id ${request.params.id}`);
        }

    } catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.patch("/:id", async (request: express.Request, response: express.Response) => {

    try {

        if (!ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }

        const id: ObjectID = new ObjectID(request.params.id);

        // Se valida el objeto
        if (!lodash.isObjectLike(request.body.user)) {
            return response.status(400).send("Bad Request: User is empty or is not an Object.");
        }
        const user: User = lodash.pick(request.body.user, ["email", "password", "tokens"]);
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


        const usersDAO: UsersDAO = new UsersDAO();
        const userUpdated: User | undefined = await usersDAO.update(user);

        if (!lodash.isUndefined(userUpdated)) {
            response.status(200).send(userUpdated);
        } else {
            response.status(404).send(`Not Found: User with id ${request.params.id}`);
        }

    } catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.get("/", async (request: express.Request, response: express.Response) => {

    try {

        const usersDAO: UsersDAO = new UsersDAO();
        const usersArray = await usersDAO.selectAll();
        response.status(200).send({ users: usersArray });

    } catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.get("/me", authenticate, async (request: express.Request, response: express.Response) => {

    try {

        response.send(request.body.user);

    } catch (error) {
        console.log("users.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});

router.get("/:id", async (request: express.Request, response: express.Response) => {

    try {

        if (!ObjectID.isValid(request.params.id)) {
            return response.status(400).send("Bad Request: ObjectID is not valid.");
        }

        const id: ObjectID = new ObjectID(request.params.id);

        const usersDAO: UsersDAO = new UsersDAO();
        const user = await usersDAO.selectById(id);
        response.status(200).send({ users: user });

    } catch (error) {
        console.log("todos.js", error.name + " " + error.message);
        response.status(500).send(error);
    }
});