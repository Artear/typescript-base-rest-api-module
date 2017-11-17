import * as Elasticsearch from "elasticsearch";
import * as config from "config";

export class ElasticSearchConnection {

    private static instance: Elasticsearch.Client = new Elasticsearch.Client({
        host: config.get<string>("elastic.host")
    });

    private Connection(): void {
    }

    public static getInstance(): Elasticsearch.Client {
        return ElasticSearchConnection.instance;
    }
}