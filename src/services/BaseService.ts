import {Next, Response, Request} from "restify";

export abstract class BaseService {

    public static findById(req: Request, res: Response, next: Next): any {}

    public static get(req: Request, res: Response, next: Next): any {}

    public static create(req: Request, res: Response, next: Next): any {}

    public static update(req: Request, res: Response, next: Next): any {}

    public static remove(req: Request, res: Response, next: Next): any {}

    public static options(req: Request, res: Response, next: Next): any {}

    public static getItems(req: Request, res: Response, next: Next): any {}
}