import LogHandler from "./LogHandler";

export interface LogConfig {
    configure(): LogHandler;
}