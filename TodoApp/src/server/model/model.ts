import { ObjectID } from "mongodb";

export class TodoAppError extends Error {
    public status: number;
}
export interface Token {
    access: string;
    token: string;
}
export interface User {
    _id?: ObjectID;
    email: string;
    password: string;
    tokens?: Token[];
}
export interface Todo {
    _id?: ObjectID;
    text: string;
    completed: boolean;
    completedAt?: Date;
    _creator: ObjectID;
}

