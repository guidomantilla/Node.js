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
const lodash = require("lodash");
const mongodb_1 = require("mongodb");
const crypto_1 = require("../crypto/crypto");
const users_1 = require("../dao/users");
function authenticate(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = request.header("x-auth");
            if (!lodash.isUndefined(token)) {
                const crypto = new crypto_1.Crypto();
                const object = crypto.verifyAuthToken(token);
                const usersDAO = new users_1.UsersDAO();
                const id = new mongodb_1.ObjectID(object._id);
                const user = yield usersDAO.selectByIdToken(id, token);
                if (!lodash.isNull(user)) {
                    request.body.user = user;
                }
                else {
                    return response.status(401).send("Unauthorized: Session not valid");
                }
            }
            next();
        }
        catch (error) {
            console.log("authenticate.js", error.name + " " + error.message);
            response.status(401).send("Unauthorized: Session not valid");
        }
    });
}
exports.authenticate = authenticate;
