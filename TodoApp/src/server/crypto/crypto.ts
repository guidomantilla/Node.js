import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as lodash from "lodash";
import { ObjectID } from "mongodb";
import { User } from "../model/model";
export class Crypto {

    private jwtSecret: string = "abc123";

    public comparePassword(password: string, hashPassword: string): boolean {

        return bcrypt.compareSync(password, hashPassword);
    }

    public hashPassword(password: string): string {

        const salt: string = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public generateAuthToken(id: ObjectID): string {

        const token = jwt.sign({ _id: id.toHexString(), access: "auth" }, this.jwtSecret);
        return token;
    }

    public verifyAuthToken(token: string): any {

        const object = jwt.verify(token, this.jwtSecret);
        return object;
    }

    private generateRandomString(length: number): string {
        return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
    }
}