"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
test1();
test2();
function test2() {
    const data = {
        id: 4
    };
    const token = jwt.sign(data, "secret");
    console.log(token);
    const decoded = jwt.verify(token, "secret");
    console.log(decoded);
}
function test1() {
    const data = {
        id: 4
    };
    const salt = "Raven123qweasd+";
    const secret = JSON.stringify(data) + salt;
    const hash = SHA256(secret);
    const token = {
        data,
        hash
    };
    console.log(token.data, token.hash);
    const resultHash = SHA256(secret);
    if (resultHash === token.hash) {
        console.log("Data OK");
    }
    else {
        console.log("Data NOT OK");
    }
}
function SHA256(data) {
    const hash = crypto.createHash("sha256");
    return hash.update(data).digest("hex");
}
