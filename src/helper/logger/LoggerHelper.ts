import LogHandler from "./LogHandler";
import ProductionLogConfig from "./ProductionLogConfig";
import DevelopLogConfig from "./DevelopLogConfig";

export default class LoggerHelper {

    private loggerHelper: LogHandler;

    private static instance : LoggerHelper = null;

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
    public static getDefaultHandler(): LogHandler {
        if (LoggerHelper.instance === null)
            LoggerHelper.instance = new LoggerHelper(process.env.NODE_ENV)
        return LoggerHelper.instance.getHandler();
    }
}