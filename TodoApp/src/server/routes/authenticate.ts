import * as express from "express";
import * as lodash from "lodash";
import { ObjectID } from "mongodb";
import { Crypto } from "../crypto/crypto";
import { UsersDAO } from "../dao/users";
import { Token, User } from "../model/model";

export async function authenticate(request: express.Request, response: express.Response, next: express.NextFunction) {

    try {

        const token: string | undefined = request.header("x-auth");
        if (!lodash.isUndefined(token)) {

            const crypto: Crypto = new Crypto();
            const object: any = crypto.verifyAuthToken(token);

            const usersDAO: UsersDAO = new UsersDAO();

            const id: ObjectID = new ObjectID(object._id);

            const user = await usersDAO.selectByIdToken(id, token);
            if (!lodash.isNull(user)) {
                request.body.user = user;
            } else {
                return response.status(401).send("Unauthorized: Session not valid");
            }
        }

        next();

    } catch (error) {
        console.log("authenticate.js", error.name + " " + error.message);
        response.status(401).send("Unauthorized: Session not valid");
    }
}