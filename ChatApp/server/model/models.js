"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatAppError extends Error {
}
exports.ChatAppError = ChatAppError;
class Message {
    constructor(from, text) {
        this.from = from;
        this.text = text;
        this.createdAt = new Date().getTime();
    }
}
exports.Message = Message;
class Coordinate {
    constructor(from, latitude, longitude) {
        this.from = from;
        this.url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = new Date().getTime();
    }
}
exports.Coordinate = Coordinate;
class UsersManager {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        const user = { id, name, room };
        this.users.push(user);
        return user;
    }
    removeUser(id) {
        const userFound = this.getUser(id);
        if (userFound) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return userFound;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room) {
        const users = this.users.filter((user) => user.room === room);
        const namesArray = users.map((user) => user.name);
        return namesArray;
    }
}
exports.UsersManager = UsersManager;
