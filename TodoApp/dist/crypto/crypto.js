"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
class Crypto {
    constructor() {
        this.jwtSecret = "abc123";
    }
    comparePassword(password, hashPassword) {
        return bcrypt.compareSync(password, hashPassword);
    }
    hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
    generateAuthToken(id) {
        const token = jwt.sign({ _id: id.toHexString(), access: "auth" }, this.jwtSecret);
        return token;
    }
    verifyAuthToken(token) {
        const object = jwt.verify(token, this.jwtSecret);
        return object;
    }
    generateRandomString(length) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
    }
}
exports.Crypto = Crypto;
