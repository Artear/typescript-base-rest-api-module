import {ExternalUrlBuilder} from "../../src/data_source/ExternalUrlBuilder";

export class ItemExternalUrlBuilder extends ExternalUrlBuilder {

    private externalSources = {
        "DM": {
            "url": "http://dummy.url.com.ar/media-api/",
            "queryParameter": "mediaIds"
        }
    };

    /**
     * Return the source url
     * @param pattern
     *      Ex: DM-5434341
     * @returns {string}
     */
    public getResourceUrlOrThrow(pattern: string): string {

        let url: string = "";

        if (pattern.match(/^[a-z]+-[0-9]+$/i)) {
            let keySource = pattern.split("-");

            if (!!this.externalSources) {
                if (this.externalSources[keySource[0]]) {
                    url = this.externalSources[keySource[0]].url + keySource[1] + ".json";
                }
            } else {
                throw new Error("External sources config is not defined");
            }
        }

        return url;
    }

    public getMultiGetResourceUrl(keys: Array<string>) {
        let url: string = "";
        let pattern = keys[0];
        if (pattern.match(/^[a-z]+-[0-9]+$/i)) {
            let keySource = pattern.split("-");
            if (!!this.externalSources &&
                (this.externalSources[keySource[0]])) {
                url = this.externalSources[keySource[0]].url;
                url = url.endsWith("/") ? url.slice(0, -1) : url;
                url += ".json?+" + this.externalSources[keySource[0]].queryParameter + "=";
                url += keys.map((v) => (
                    v.split("-")[1] + ","
                ));
            } else {
                throw new Error("External sources config is not defined");
            }
        }
        return url.slice(0, -1);
    }

}