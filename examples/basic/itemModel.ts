export declare namespace Model {

    export interface Title {
        main: string;
        social: string;
        headline: string;
    }

    export interface Block {
        type: BlockType;
        content: string|string[];
    }

    export enum BlockType {
        STRING,
        MEDIA,
        FACEBOOK,
        TWITTER,
        YOUTUBE,
        INSTAGRAM,
        SCRIBD,
        THINGLINK,
        VINE,
        VIMEO,
        GALLERY
    }

    export interface Content {
        title: Title;
        dropline: Block[];
        body: Block[];
        media: string[];
        createdISO: string;
        changedISO: string;
        tagList: Tag[];
    }

    export interface Tag {
        name: string;
        machineName: string;
    }

    export interface Item {
        itemId: string;
        content: Content;
    }
}

