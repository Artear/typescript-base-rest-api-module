import * as Elasticsearch from "elasticsearch";
import * as config from "config";

export class ElasticSearchConnection {

    private static instance: Elasticsearch.Client;

    private Connection(): void {
    }

    public static getInstance(): Elasticsearch.Client {
        return this.instance || (this.instance = new Elasticsearch.Client({ host: config.get<string>("elastic.host")}));
    }
}
