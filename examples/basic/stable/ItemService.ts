import {Next, Request, Response} from "restify";
import {NotFoundError, NotImplementedError, NotAcceptableError} from "restify-errors";
import {BaseService} from "../../../src/services/BaseService";
import {RestifyValidation} from "../../../src/helper/validation/restify/validation";
import {itemSchemaPost, itemSchemaUpdate} from "./itemSchema";
import {ItemController} from "../ItemController";
import {Model} from "../itemModel";

export default class ItemService extends BaseService {

    static controller: ItemController = new ItemController();

    @RestifyValidation.isAlphanumeric("id")
    public static findById(req: Request, res: Response, next: Next): void {

        if (!!req.params) {
            const id: string = req.params.id;
            const fields: string = (req.params.fields || "");

            ItemService.controller.getItem(id, fields).then((data) => {
                res.send(200, data);
            }).catch((err) => {
                res.send(err);
            });
        } else {
            res.send(new NotFoundError);
        }
    }

    @RestifyValidation.validateBodyWithSchema(itemSchemaPost)
    public static create(req: Request, res: Response, next: Next): void {
        let item: Model.Item = req.params;
        ItemService.controller.createItem(item).then((data) => {
            res.send(201, data);
        }).catch((err) => {
            res.send(err);
        });
    }

    @RestifyValidation.isAlphanumeric("id")
    @RestifyValidation.validateBodyWithSchema(itemSchemaUpdate)
    public static update(req: Request, res: Response, next: Next): void {
        let item: Model.Item = req.params;
        ItemService.controller.updateItem(item).then((data) => {
            res.send(200, data);
        }).catch((err) => {
            res.send(err);
        });
    }

    public static options(req: Request, res: Response, next: Next): void {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "authorization");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.send(200);
        return next();
    }

    public static getItems(req: Request, res: Response, next: Next): void {
        res.send(200, "stable!");
        return;
    }
    public static patch(req: Request, res: Response, next: Next): void {
        res.send(new NotImplementedError());
        return next();
    }

}
