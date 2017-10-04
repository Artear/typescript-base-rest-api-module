import {RouterConfig} from "../../../src/router/BaseRouter";
import ItemServiceStable from "./ItemServiceStable";

export class ItemRouterStable extends RouterConfig {

    protected onConfig(): void {

        this.get("/items", ItemServiceStable.getItems);
        this.get("/items/:id", ItemServiceStable.findById);
        this.post("/items", ItemServiceStable.create);
        this.put("/items", ItemServiceStable.update);
        this.opts("/items", ItemServiceStable.options);
        this.patch("/items", ItemServiceStable.patch);
    }
}