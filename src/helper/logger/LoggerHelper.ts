import LogHandler from "./LogHandler";
import ProductionLogConfig from "./ProductionLogConfig";
import DevelopLogConfig from "./DevelopLogConfig";

class LoggerHelper {

    private loggerHelper: LogHandler;

    constructor(env?: string) {
        switch (env) {
            case "development":
                this.loggerHelper = (new DevelopLogConfig()).configure();
                break;
            default:
                this.loggerHelper = (new ProductionLogConfig()).configure();
        }
    }

    public getHandler(): LogHandler {
        return this.loggerHelper;
    }
}

export default new LoggerHelper(process.env.NODE_ENV).getHandler();