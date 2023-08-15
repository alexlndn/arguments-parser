export declare type argumentsParserParams = {
    explicit: Boolean; // use configuration file: default false
    keepAsArray: Boolean; // true: keep all values as arrays or false: if only one value to the item, the item config will be this single value (not an array) : default false
    onlyParamsArray: Boolean; // returns an array of received params : default false
    offset: number; // offset for removing default params of node : default 2
};

export declare function argumentsParser(params: argumentsParserParams): void;
