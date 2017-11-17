import {Logger} from "./Logger";
import LogHandler from "./LogHandler";
import ServerLogger from "./ServerLogger";

export class LogBuilder {

    private loggers: Array<Logger> = [];
    private level: string;

    constructor() {
        this.level = "info";
    }

    public withLogger(logger: Logger): LogBuilder {
        this.loggers.push(logger);
        return this;
    }

    public withLevel(level: string): LogBuilder {
        this.level = level;
        return this;
    }

    public build(): LogHandler {

        // default logger
        this.withLogger(new ServerLogger);

        // apply log level
        this.loggers.forEach((logger: Logger) => {
            logger.setLevel(this.level);
        });

        return new LogHandler(this.loggers);
    }
}

export default LogBuilder;