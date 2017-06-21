export abstract class Logger {
    protected level: string;
    public abstract info(msg: string | Object): void;
    public abstract debug(msg: string | Object): void;
    public abstract warn(msg: string | Object): void;
    public abstract error(msg: string | Object | Error): void;

    public setLevel(level: string): void {
        this.level = level;
    }
}