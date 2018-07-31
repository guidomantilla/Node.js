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
const mongodb_1 = require("../db/mongodb");
class UsersDAO {
    constructor() {
        this.usersColl = mongodb_1.TodoAppDb.collection("Users");
    }
    insert(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.selectByEmail(user.email);
            if (lodash.isEmpty(userFound)) {
                const result = yield this.usersColl.insertOne(user);
                if (result.result.ok === 1) {
                    return result.ops[0];
                }
            }
            return undefined;
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersColl.findOneAndUpdate({ _id: user._id }, user);
            if (result.ok === 1) {
                return result.value;
            }
            return undefined;
        });
    }
    selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersArray = yield this.usersColl.find().toArray();
            return usersArray;
        });
    }
    selectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersColl.findOne({ _id: id });
            return user;
        });
    }
    selectByIdToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersColl.findOne({ "_id": id, "tokens.token": token, "tokens.access": "auth" });
            return user;
        });
    }
    selectByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersColl.findOne({ email });
            return user;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersColl.findOne({ _id: id });
            if (!lodash.isNull(user)) {
                const result = yield this.usersColl.deleteOne({ _id: id });
                if (result.result.ok === 1) {
                    return true;
                }
            }
            return false;
        });
    }
}
exports.UsersDAO = UsersDAO;
