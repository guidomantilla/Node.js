import * as lodash from "lodash";
import {
    Collection, DeleteWriteOpResultObject,
    FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, ObjectID
} from "mongodb";
import { TodoAppDb } from "../db/mongodb";
import { Todo } from "../model/model";

export class TodosDAO {

    private todosColl: Collection;

    constructor() {
        this.todosColl = TodoAppDb.collection("Todos");
    }

    public async insert(todo: Todo): Promise<Todo | undefined> {

        const todoFound = await this.todosColl.findOne({ _id: todo._id });
        if (lodash.isEmpty(todoFound)) {

            const result: InsertOneWriteOpResult = await this.todosColl.insertOne(todo);
            if (result.result.ok === 1) {
                return (result.ops[0] as Todo);
            }
        }
        return undefined;
    }

    public async update(todo: Todo): Promise<Todo | undefined> {

        const result: FindAndModifyWriteOpResultObject =
            await this.todosColl.findOneAndUpdate({ _id: todo._id }, todo);

        if (result.ok === 1) {
            return result.value;
        }

        return undefined;
    }

    public async updateCreator(todo: Todo): Promise<Todo | undefined> {

        const result: FindAndModifyWriteOpResultObject =
            await this.todosColl.findOneAndUpdate({ _id: todo._id, _creator: todo._creator }, todo);

        if (result.ok === 1) {
            return result.value;
        }

        return undefined;
    }

    public async delete(id: ObjectID): Promise<boolean> {

        const todo = await this.todosColl.findOne({ _id: id });

        if (!lodash.isNull(todo)) {

            const result: DeleteWriteOpResultObject = await this.todosColl.deleteOne({ _id: id });
            if (result.result.ok === 1) {
                return true;
            }
        }
        return false;
    }
    public async deleteByCreator(id: ObjectID, creator: ObjectID): Promise<boolean> {

        const todo = await this.selectByIdCreator(id, creator);

        if (!lodash.isNull(todo)) {

            const result: DeleteWriteOpResultObject = await this.todosColl.deleteOne({ _id: id, _creator: creator });
            if (result.result.ok === 1) {
                return true;
            }
        }
        return false;
    }

    public async selectAll(): Promise<Todo[]> {

        const todosArray = await this.todosColl.find().toArray();
        return todosArray;
    }

    public async selectByCreator(creator: ObjectID): Promise<Todo[]> {

        const todosArray = await this.todosColl.find({ _creator: creator }).toArray();
        return todosArray;
    }

    public async selectByIdCreator(id: ObjectID, creator: ObjectID): Promise<Todo> {

        const todo = await this.todosColl.findOne({ _id: id, _creator: creator });
        return todo;
    }

    public async selectById(id: ObjectID): Promise<Todo> {

        const todo = await this.todosColl.findOne({ _id: id });
        return todo;
    }
}