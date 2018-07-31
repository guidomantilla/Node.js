"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const helpers_1 = require("./helpers");
// TODO: Volverlos Promises
exports.data = {
    baseDir: path.join(__dirname, "./../../.data/"),
    create: (dir, file, obj, callback) => {
        const folderPath = exports.data.baseDir + dir + path.sep;
        console.log("create", dir, file, folderPath);
        fs.exists(folderPath, (exists) => {
            if (!exists) {
                fs.mkdirSync(folderPath);
            }
            const fullPath = folderPath + file + ".json";
            fs.open(fullPath, "w", (errorOpen, fileDescriptor) => {
                if (!errorOpen && fileDescriptor) {
                    const jsonData = JSON.stringify(obj);
                    fs.writeFile(fullPath, jsonData, (errorWrite) => {
                        if (!errorWrite) {
                            fs.close(fileDescriptor, (errorClose) => {
                                if (!errorClose) {
                                    callback(undefined);
                                }
                                else {
                                    callback("Error closing new file");
                                }
                            });
                        }
                        else {
                            callback("Error writing to new file");
                        }
                    });
                }
                else {
                    callback("Could not create new file, it may already exist");
                }
            });
        });
    },
    // tslint:disable-next-line:max-line-length
    read: (dir, file, callback) => {
        const folderPath = exports.data.baseDir + dir + path.sep;
        console.log("read", dir, file, folderPath);
        fs.exists(folderPath, (exists) => {
            if (!exists) {
                fs.mkdirSync(folderPath);
            }
            const fullPath = folderPath + file + ".json";
            fs.readFile(fullPath, "utf8", (errorRead, json) => {
                if (!errorRead && json) {
                    const parsedData = helpers_1.helpers.parseJsonToObject(json);
                    callback(undefined, parsedData);
                }
                else {
                    callback("Archivo no se puede leer. Posiblemente no exista.", json);
                }
            });
        });
    },
    update: (dir, file, obj, callback) => {
        const folderPath = exports.data.baseDir + dir + path.sep;
        console.log("update", dir, file, folderPath);
        fs.exists(folderPath, (exists) => {
            if (!exists) {
                fs.mkdirSync(folderPath);
            }
            const fullPath = folderPath + file + ".json";
            fs.open(fullPath, "w", (errorOpen, fileDescriptor) => {
                if (!errorOpen && fileDescriptor) {
                    const jsonData = JSON.stringify(obj);
                    fs.truncate(fullPath, (errorTruncate) => {
                        if (!errorTruncate) {
                            fs.writeFile(fullPath, jsonData, (errorWrite) => {
                                if (!errorWrite) {
                                    fs.close(fileDescriptor, (errorClose) => {
                                        if (!errorClose) {
                                            callback(undefined);
                                        }
                                        else {
                                            callback("Error closing existing file");
                                        }
                                    });
                                }
                                else {
                                    callback("Error writing to existing file");
                                }
                            });
                        }
                        else {
                            callback("Error truncating file");
                        }
                    });
                }
                else {
                    callback("Could not open file for updating, it may not exist yet");
                }
            });
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (dir, file, callback) => {
        const folderPath = exports.data.baseDir + dir + path.sep;
        const fullPath = folderPath + file + ".json";
        console.log("delete", dir, file, folderPath);
        fs.unlink(fullPath, (errorUnlink) => {
            if (!errorUnlink) {
                callback(undefined);
            }
            else {
                callback("Error deleting file");
            }
        });
    }
};
