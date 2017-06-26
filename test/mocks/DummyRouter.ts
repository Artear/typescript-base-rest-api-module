import {RouterConfig} from "../../src/router/BaseRouter";
import DummyService from "./DummyService";

export class DummyRouter extends RouterConfig {
    protected onConfig(): void {
        this.get("/dummy/:id", DummyService.getItem);
    }
}