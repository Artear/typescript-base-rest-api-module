export declare interface DataSource {

    getData(key: string, fields?: string): Promise<any>;

    putData(key: string, value: any): Promise<any>;

    getItems(keys: Array<string>, fields?: string): Promise<any>;

    updateData(key: string, value: Object): Promise<any>;

    filterData(field: string, value: string): Promise<any>;
}