import {LogConfig} from "./LogConfig";
import LogBuilder from "./LogBuilder";
import LogHandler from "./LogHandler";

export default class DevelopLogConfig implements LogConfig {

    configure(): LogHandler {
        return (new LogBuilder)
            .withLevel("info")
            .build();
    }
}