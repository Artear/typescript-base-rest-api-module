export declare interface DataSource {

    getData(key: string, fields?: string, options?: Object): Promise<any>;

    putData(key: string, value: any): Promise<any>;

    getItems(keys: Array<string>, fields?: string,  options?: Object): Promise<any>;

    updateData(key: string, value: Object): Promise<any>;
    
    updateDataRaw(params: any): Promise<any>;

    searchData(query: any): Promise<any>;

    deleteItem(key: string): Promise<any>;
}