import {Next, Request, Response} from "restify";
import {BaseService} from "../../src/services/BaseService";
import {RestifyValidation} from "../../src/helper/validation/restify/validation";

export default class DummyService extends BaseService {

    private static dummy_data = {
        id: 1
    };

    @RestifyValidation.isNumeric("id")
    public static getItem(req: Request, res: Response, next: Next): void {
        res.send(200, DummyService.dummy_data);
    }
}