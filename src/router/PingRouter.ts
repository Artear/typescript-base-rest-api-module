import {RouterConfig} from "./BaseRouter";
import SomeEndpointRouter from "../services/PingEndpointService";

export class PingRouter extends RouterConfig {
    protected onConfig(): void {
        this.get("/ping", SomeEndpointRouter);
    }
}