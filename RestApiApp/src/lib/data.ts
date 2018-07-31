import * as fs from "fs";
import * as path from "path";
import { helpers } from "./helpers";

// TODO: Volverlos Promises
export const data = {
    baseDir: path.join(__dirname, "./../../.data/"),
    create: (dir: string, file: string, obj: object, callback: (message: string | undefined) => void) => {

        const folderPath = data.baseDir + dir + path.sep;
        console.log("create", dir, file, folderPath);

        fs.exists(folderPath, (exists: boolean) => {

            if (!exists) {
                fs.mkdirSync(folderPath);
            }

            const fullPath = folderPath + file + ".json";
            fs.open(fullPath, "w", (errorOpen: NodeJS.ErrnoException, fileDescriptor: number) => {

                if (!errorOpen && fileDescriptor) {
                    const jsonData = JSON.stringify(obj);

                    fs.writeFile(fullPath, jsonData, (errorWrite: NodeJS.ErrnoException) => {

                        if (!errorWrite) {

                            fs.close(fileDescriptor, (errorClose: NodeJS.ErrnoException) => {

                                if (!errorClose) {
                                    callback(undefined);
                                } else {
                                    callback("Error closing new file");
                                }
                            });

                        } else {
                            callback("Error writing to new file");
                        }
                    });
                } else {
                    callback("Could not create new file, it may already exist");
                }
            });
        });
    },
    // tslint:disable-next-line:max-line-length
    read: (dir: string, file: string, callback: (message: string | undefined, obj?: object | string | undefined) => void) => {

        const folderPath = data.baseDir + dir + path.sep;
        console.log("read", dir, file, folderPath);

        fs.exists(folderPath, (exists: boolean) => {

            if (!exists) {
                fs.mkdirSync(folderPath);
            }

            const fullPath = folderPath + file + ".json";
            fs.readFile(fullPath, "utf8", (errorRead: NodeJS.ErrnoException, json: string) => {

                if (!errorRead && json) {
                    const parsedData: object | undefined = helpers.parseJsonToObject(json);
                    callback(undefined, parsedData);
                } else {
                    callback("Archivo no se puede leer. Posiblemente no exista.", json);
                }
            });
        });
    },
    update: (dir: string, file: string, obj: object, callback: (message: string | undefined) => void) => {

        const folderPath = data.baseDir + dir + path.sep;
        console.log("update", dir, file, folderPath);

        fs.exists(folderPath, (exists: boolean) => {

            if (!exists) {
                fs.mkdirSync(folderPath);
            }

            const fullPath = folderPath + file + ".json";
            fs.open(fullPath, "w", (errorOpen: NodeJS.ErrnoException, fileDescriptor: number) => {

                if (!errorOpen && fileDescriptor) {
                    const jsonData = JSON.stringify(obj);

                    fs.truncate(fullPath, (errorTruncate: NodeJS.ErrnoException) => {

                        if (!errorTruncate) {

                            fs.writeFile(fullPath, jsonData, (errorWrite: NodeJS.ErrnoException) => {

                                if (!errorWrite) {

                                    fs.close(fileDescriptor, (errorClose: NodeJS.ErrnoException) => {

                                        if (!errorClose) {
                                            callback(undefined);
                                        } else {
                                            callback("Error closing existing file");
                                        }
                                    });

                                } else {
                                    callback("Error writing to existing file");
                                }
                            });

                        } else {
                            callback("Error truncating file");
                        }
                    });

                } else {
                    callback("Could not open file for updating, it may not exist yet");
                }
            });
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (dir: string, file: string, callback: (message: string | undefined) => void) => {

        const folderPath = data.baseDir + dir + path.sep;
        const fullPath = folderPath + file + ".json";
        console.log("delete", dir, file, folderPath);

        fs.unlink(fullPath, (errorUnlink: NodeJS.ErrnoException) => {

            if (!errorUnlink) {
                callback(undefined);
            } else {
                callback("Error deleting file");
            }
        });
    }
};