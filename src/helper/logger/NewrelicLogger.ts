import {Logger} from "./Logger";
import * as config from "config";
const yn = require("yn");

export default class NewrelicLogger extends Logger {

    constructor() {
        super();

        this.init();
    }

    public init() {
        if (yn(config.get<string>("newrelic.enable"))) {
            try {
                require("newrelic");
            } catch (e) {
                console.error(e);
            }
        }
    }
}