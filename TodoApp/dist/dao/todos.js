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
class TodosDAO {
    constructor() {
        this.todosColl = mongodb_1.TodoAppDb.collection("Todos");
    }
    insert(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            const todoFound = yield this.todosColl.findOne({ _id: todo._id });
            if (lodash.isEmpty(todoFound)) {
                const result = yield this.todosColl.insertOne(todo);
                if (result.result.ok === 1) {
                    return result.ops[0];
                }
            }
            return undefined;
        });
    }
    update(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.todosColl.findOneAndUpdate({ _id: todo._id }, todo);
            if (result.ok === 1) {
                return result.value;
            }
            return undefined;
        });
    }
    updateCreator(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.todosColl.findOneAndUpdate({ _id: todo._id, _creator: todo._creator }, todo);
            if (result.ok === 1) {
                return result.value;
            }
            return undefined;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield this.todosColl.findOne({ _id: id });
            if (!lodash.isNull(todo)) {
                const result = yield this.todosColl.deleteOne({ _id: id });
                if (result.result.ok === 1) {
                    return true;
                }
            }
            return false;
        });
    }
    deleteByCreator(id, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield this.selectByIdCreator(id, creator);
            if (!lodash.isNull(todo)) {
                const result = yield this.todosColl.deleteOne({ _id: id, _creator: creator });
                if (result.result.ok === 1) {
                    return true;
                }
            }
            return false;
        });
    }
    selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const todosArray = yield this.todosColl.find().toArray();
            return todosArray;
        });
    }
    selectByCreator(creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const todosArray = yield this.todosColl.find({ _creator: creator }).toArray();
            return todosArray;
        });
    }
    selectByIdCreator(id, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield this.todosColl.findOne({ _id: id, _creator: creator });
            return todo;
        });
    }
    selectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield this.todosColl.findOne({ _id: id });
            return todo;
        });
    }
}
exports.TodosDAO = TodosDAO;
