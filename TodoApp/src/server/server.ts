import * as http from "http";
import { Server } from "http";
import { app } from "./app";

const port: string | number = process.env.PORT || 3000;

const server: Server = http.createServer(app);
server.listen(port);