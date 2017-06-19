import {Logger} from "./Logger";

export default class LogHandler {

    private loggers: Array<Logger>;

    constructor(loggers: Array<Logger>) {
        this.loggers = loggers;
    }

    public info(log: string | Object): void {
        for (let logger of this.loggers) {
            logger.info(log);
        }
    }

    public debug(log: string | Object): void {
        for (let logger of this.loggers) {
            logger.debug(log);
        }
    }

    public warn(log: string | Object): void {
        for (let logger of this.loggers) {
            logger.warn(log);
        }
    }

    public error(log: string | Object | Error): void {
        for (let logger of this.loggers) {
            logger.error(log);
        }
    }
}