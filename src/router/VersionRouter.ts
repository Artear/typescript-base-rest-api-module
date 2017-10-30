import {RouterConfig} from "./BaseRouter";
import VersionService from "../services/VersionService";

export class VersionRouter extends RouterConfig {
    protected onConfig(): void {
        this.get("/_version.txt", VersionService.getVersion);
    }
}