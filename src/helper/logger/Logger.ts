export abstract class Logger {
    protected level: string;
    public info(msg: string | Object): void {};
    public debug(msg: string | Object): void{};
    public warn(msg: string | Object): void {};
    public error(msg: string | Object | Error): void {};

    public setLevel(level: string): void {
        this.level = level;
    }
}