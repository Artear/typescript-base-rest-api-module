import * as Debug from "debug";
import {Logger} from "./Logger";
import * as winston from "winston";
import * as config from "config";

let CloudWatchTransport = require("winston-cloudwatch");

const debug = Debug(process.env.DEBUG || "server-log");

export default class ServerLogger extends Logger {

    constructor() {
        super();
    }

    info(msg: string | Object): void {
        winston.info(this.__string(msg));
    }

    debug(msg: string | Object): void {
        debug(msg);
    }

    warn(msg: string | Object): void {
        winston.warn(this.__string(msg));
    }

    error(msg: string | Object | Error): void {
        winston.error(this.__string(msg));
    }

    setLevel(level: string): void {
        winston.configure({
            level: level,
            transports: [
                new (winston.transports.Console)()
            ]
        });
    }


    private __string(obj) {
        return this.appendDateTimeToMessage(JSON.stringify(obj));
    }

    private appendDateTimeToMessage(message: string) {
        return new Date().toLocaleString() + "\t" + message;
    }
}