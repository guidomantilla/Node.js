import { Db, MongoClient } from "mongodb";

export let TodoAppDb: Db;

config();

async function config() {
    try {

        const url: string = process.env.MONGODB_URI || "mongodb://localhost:27017";

        const database: MongoClient = await MongoClient.connect(url);
        console.log("Connected to MongoDB", url);

        const databaseName = getDatabaseName(url);
        console.log("Heroku databaseName", databaseName);

        TodoAppDb = database.db(databaseName);

    } catch (error) {
        console.log("mongodb.js", error.name + " " + error.message);
    }
}

function getDatabaseName(url: string): string {

    if (url.indexOf("localhost") !== -1) {

        return "TodoApp";

    } else {

        const temp: string = (process.env.MONGODB_URI as string);
        const init: number = temp.lastIndexOf("/");
        const end: number = temp.length;

        return temp.substring(init + 1, end);
    }
}
