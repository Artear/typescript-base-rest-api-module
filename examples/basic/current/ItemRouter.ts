import {RouterConfig} from "../../../src/router/BaseRouter";
import ItemService from "./ItemService";
import ItemSearchService from "./ItemSearchService";
import {withSecurity} from "../../../src/server/SecurityMiddleware";
import * as config from "config";

export class ItemRouter extends RouterConfig {
    protected onConfig(): void {
        const token = config.get<string>("security.token");
        const wrappedWithSecurity = (middleware) => config.get<string>("security.enable") ? withSecurity(token)(middleware) : middleware;

        this.get("/items", wrappedWithSecurity(ItemService.getItems));
        this.get("/items/:id", wrappedWithSecurity(ItemService.findById));
        this.post("/items", wrappedWithSecurity(ItemService.create));
        this.put("/items", wrappedWithSecurity(ItemService.update));
        this.opts("/items", wrappedWithSecurity(ItemService.options));
        this.patch("/items", wrappedWithSecurity(ItemService.patch));
        this.get("/search", wrappedWithSecurity(ItemSearchService.get));
    }
}
