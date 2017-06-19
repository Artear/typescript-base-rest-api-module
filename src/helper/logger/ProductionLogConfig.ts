import {LogConfig} from "./LogConfig";
import LogBuilder from "./LogBuilder";
import LogHandler from "./LogHandler";

export default class ProductionLogConfig implements LogConfig {

    configure(): LogHandler {
        return (new LogBuilder)
            .withLevel("error")
            .build();
    }
}