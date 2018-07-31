import { Server } from "http";
import * as lodash from "lodash";
import * as socketIO from "socket.io";
import { Coordinate, Message, User, UsersManager } from "../model/models";
import { isRealString } from "../util/utils";

export class Events {

    private io: SocketIO.Server;
    private usersManager: UsersManager;

    constructor(server: Server) {
        this.io = socketIO(server);
        this.usersManager = new UsersManager();
    }

    public onConnection() {

        this.io.on("connection", (socket: SocketIO.Socket) => {

            console.log("New User Connected");

            // tslint:disable-next-line:ban-types
            socket.on("join", (params, callback: Function) => {
                if (!isRealString(params.name) || !isRealString(params.room)) {
                    callback("Name and room name are required.");
                }

                this.usersManager.removeUser(socket.id);
                const user: User = this.usersManager.addUser(socket.id, params.name, params.room);

                socket.join(user.room);
                this.io.to(user.room).emit("updateUserList", this.usersManager.getUserList(user.room));
                socket.emit("newMessage", new Message("Admin", "Welcome to the chat app"));
                socket.broadcast.to(user.room)
                    .emit("newMessage", new Message("Admin", `${user.name} has joined.`));

                callback();
            });

            // tslint:disable-next-line:ban-types
            socket.on("createMessage", (newMessage: Message, callback: Function) => {

                const user: User = this.usersManager.getUser(socket.id);
                this.io.to(user.room)
                    .emit("newMessage", new Message(user.name, newMessage.text));

                if (lodash.isFunction(callback) && !lodash.isUndefined(lodash)) {
                    callback("This is from the server.");
                }
            });

            socket.on("createLocationMessage", (coordinate: Coordinate) => {

                const user: User = this.usersManager.getUser(socket.id);
                this.io.to(user.room).emit("newLocationMessage",
                    new Coordinate("Admin", coordinate.latitude, coordinate.longitude));
            });

            socket.on("disconnect", () => {
                const user: User = this.usersManager.removeUser(socket.id);

                if (user) {
                    this.io.to(user.room).emit("updateUserList", this.usersManager.getUserList(user.room));
                    this.io.to(user.room).emit("newMessage", new Message("Admin", `${user.name} has left.`));
                }
            });
        });
    }
}

