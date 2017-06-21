import {RouterConfig} from "../../src/router/BaseRouter";
import ItemService from "./ItemService";

export class ItemRouter extends RouterConfig {
    protected onConfig(): void {
        this.get("/items", ItemService.getItems);
        this.get("/items/:id", ItemService.findById);
        this.post("/items", ItemService.create);
        this.put("/items", ItemService.update);
        this.opts("/items", ItemService.options);
        this.patch("/items", ItemService.patch);
    }
}