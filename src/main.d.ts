export declare type argumentsParserParams = {
    explicit: true; // use configuration file: default false
    keepAsArray: true; // true: keep all values as arrays or false: if only one value to the item, the item config will be this single value (not an array) : default false
    onlyParamsArray: true; // returns an array of received params : default false
    offset: 2; // offset for removing default params of node : default 2
};

export declare function argumentsParser(params: argumentsParserParams): void;
