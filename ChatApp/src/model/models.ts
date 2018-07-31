export class ChatAppError extends Error {

    public status: number;
}

export class Message {

    public from: string;
    public text: string;
    public createdAt: number;

    constructor(from: string, text: string) {
        this.from = from;
        this.text = text;
        this.createdAt = new Date().getTime();
    }
}
export class Coordinate {

    public from: string;
    public url: string;
    public latitude: number;
    public longitude: number;
    public createdAt: number;

    constructor(from: string, latitude: number, longitude: number) {
        this.from = from;
        this.url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = new Date().getTime();
    }
}

export interface User {
    id: string;
    name: string;
    room: string;
}

export class UsersManager {

    private users: User[];

    constructor() {
        this.users = [];
    }

    public addUser(id: string, name: string, room: string) {
        const user: User = { id, name, room };
        this.users.push(user);
        return user;
    }

    public removeUser(id: string) {
        const userFound: User = this.getUser(id);

        if (userFound) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return userFound;
    }

    public getUser(id: string) {
        return this.users.filter((user) => user.id === id)[0];
    }

    public getUserList(room: string) {
        const users: User[] = this.users.filter((user) => user.room === room);
        const namesArray: string[] = users.map((user) => user.name);

        return namesArray;
    }
}