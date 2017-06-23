/**
 * Class that build url fallbacks
 * DM-12345 -> http://dummy.localhost.com.ar/items/12345
 */
export abstract class ExternalUrlBuilder {
    /**
     * Return the source url
     * @param pattern
     *      Ex: DM-5434341
     * @returns {string}
     */
    public abstract getResourceUrlOrThrow(pattern: string): string;

    /**
     * Return the source url to fetch multiple items (multiget)
     * @param keys
     *      Ex: DM-1234,DM-4321
     * @returns {string}
     */
    public abstract getMultiGetResourceUrl(keys: Array<string>): string;
}