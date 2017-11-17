import {Next, Request, Response} from "restify";
import {BaseService} from "../../../src/services/BaseService";
import {ItemController} from "../ItemController";

export default class ItemSearchService extends BaseService {

    static controller: ItemController = new ItemController();

    public static get(req: Request, res: Response, next: Next): void {
        const query: string = req.query.q;
        ItemSearchService.controller.search(query).then((data) => {
            res.send(200, data);
        }).catch((err) => {
            res.send(err);
        });
    }

}