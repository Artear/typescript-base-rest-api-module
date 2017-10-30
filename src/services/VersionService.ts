import {Next, Response, Request} from "restify";
import {BaseService} from "./BaseService";
import * as fs from "fs";

export default class VersionService extends BaseService {

    public static getVersion(req: Request, res: Response, next: Next): void {
        const filePath = "./_version.txt";

        res.setHeader("Content-Type", "text/plain");

        if (fs.existsSync(filePath)) {
            const versionFile = fs.readFileSync(filePath, "utf-8");
            res.send(200, versionFile);
        } else {
            res.send(404, "Version file not exists.");
        }
        return next();
    }
}