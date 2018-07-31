import * as lodash from "lodash";
import {
    Collection, DeleteWriteOpResultObject,
    FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, ObjectID
} from "mongodb";
import { TodoAppDb } from "../db/mongodb";
import { Token, User } from "../model/model";
export class UsersDAO {

    private usersColl: Collection;

    constructor() {
        this.usersColl = TodoAppDb.collection("Users");
    }

    public async insert(user: User): Promise<User | undefined> {

        const userFound = await this.selectByEmail(user.email);
        if (lodash.isEmpty(userFound)) {

            const result: InsertOneWriteOpResult = await this.usersColl.insertOne(user);
            if (result.result.ok === 1) {
                return (result.ops[0] as User);
            }
        }
        return undefined;
    }

    public async update(user: User): Promise<User | undefined> {

        const result: FindAndModifyWriteOpResultObject =
            await this.usersColl.findOneAndUpdate({ _id: user._id }, user);

        if (result.ok === 1) {
            return result.value;
        }

        return undefined;
    }

    public async selectAll(): Promise<User[]> {

        const usersArray = await this.usersColl.find().toArray();
        return usersArray;
    }

    public async selectById(id: ObjectID): Promise<User> {

        const user = await this.usersColl.findOne({ _id: id });
        return user;
    }

    public async selectByIdToken(id: ObjectID, token: string): Promise<User> {

        const user = await this.usersColl.findOne({ "_id": id, "tokens.token": token, "tokens.access": "auth" });
        return user;
    }

    public async selectByEmail(email: string): Promise<User> {

        const user = await this.usersColl.findOne({ email });
        return user;
    }

    public async delete(id: ObjectID): Promise<boolean> {

        const user = await this.usersColl.findOne({ _id: id });

        if (!lodash.isNull(user)) {

            const result: DeleteWriteOpResultObject = await this.usersColl.deleteOne({ _id: id });
            if (result.result.ok === 1) {
                return true;
            }
        }
        return false;
    }
}



