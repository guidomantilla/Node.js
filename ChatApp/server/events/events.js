"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const socketIO = require("socket.io");
const models_1 = require("../model/models");
const utils_1 = require("../util/utils");
class Events {
    constructor(server) {
        this.io = socketIO(server);
        this.usersManager = new models_1.UsersManager();
    }
    onConnection() {
        this.io.on("connection", (socket) => {
            console.log("New User Connected");
            // tslint:disable-next-line:ban-types
            socket.on("join", (params, callback) => {
                if (!utils_1.isRealString(params.name) || !utils_1.isRealString(params.room)) {
                    callback("Name and room name are required.");
                }
                this.usersManager.removeUser(socket.id);
                const user = this.usersManager.addUser(socket.id, params.name, params.room);
                socket.join(user.room);
                this.io.to(user.room).emit("updateUserList", this.usersManager.getUserList(user.room));
                socket.emit("newMessage", new models_1.Message("Admin", "Welcome to the chat app"));
                socket.broadcast.to(user.room)
                    .emit("newMessage", new models_1.Message("Admin", `${user.name} has joined.`));
                callback();
            });
            // tslint:disable-next-line:ban-types
            socket.on("createMessage", (newMessage, callback) => {
                const user = this.usersManager.getUser(socket.id);
                this.io.to(user.room)
                    .emit("newMessage", new models_1.Message(user.name, newMessage.text));
                if (lodash.isFunction(callback) && !lodash.isUndefined(lodash)) {
                    callback("This is from the server.");
                }
            });
            socket.on("createLocationMessage", (coordinate) => {
                const user = this.usersManager.getUser(socket.id);
                this.io.to(user.room).emit("newLocationMessage", new models_1.Coordinate("Admin", coordinate.latitude, coordinate.longitude));
            });
            socket.on("disconnect", () => {
                const user = this.usersManager.removeUser(socket.id);
                if (user) {
                    this.io.to(user.room).emit("updateUserList", this.usersManager.getUserList(user.room));
                    this.io.to(user.room).emit("newMessage", new models_1.Message("Admin", `${user.name} has left.`));
                }
            });
        });
    }
}
exports.Events = Events;
