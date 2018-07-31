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
const mongodb_1 = require("mongodb");
config();
function config() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
            const database = yield mongodb_1.MongoClient.connect(url);
            console.log("Connected to MongoDB", url);
            const databaseName = getDatabaseName(url);
            console.log("Heroku databaseName", databaseName);
            exports.TodoAppDb = database.db(databaseName);
        }
        catch (error) {
            console.log("mongodb.js", error.name + " " + error.message);
        }
    });
}
function getDatabaseName(url) {
    if (url.indexOf("localhost") !== -1) {
        return "TodoApp";
    }
    else {
        const temp = process.env.MONGODB_URI;
        const init = temp.lastIndexOf("/");
        const end = temp.length;
        return temp.substring(init + 1, end);
    }
}
