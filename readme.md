# arguments-parser

## [![NPM](https://nodei.co/npm/arguments-parser.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/arguments-parser/)

## [![npm version](https://badge.fury.io/js/arguments-parser.svg)](https://badge.fury.io/js/arguments-parser)

A simple and configurable node arguments parser.

## Usage

```js
const args = require('arguments-parser')();
console.log(args); // output: { 'p': 2300 }
```

> running: node index.js -p 2300

Number and booleans are parsed.

**Since v2.0.0 the output object has no keys middle dashs**

## Configuration

1. Create a folder named _config_.
2. Create a file named _arguments-parser.json_ inside _config_ folder.
3. Create an array of available arguments strings inside _arguments-parser.json_ file.
4. Call arguments-parser with configuration object.

### Configuration object

```js
const args = require('arguments-parser')({
    explicit: true, // use configuration file: default false
    keepAsArray: true, // true: keep all values as arrays or false: if only one value to the item, the item config will be this single value (not an array) : default false
    onlyParamsArray: true // returns an array of received params : default false
    offset: 2 // offset for removing default params of node : default 2
})
```

**If explicit mode is set to true and no configuration file exists in config folder, a warning message will appear into console.**
**If onlyParamsArray is set to true, explicit and keepAsArray will be ignored**

## Example: _arguments-parser.json_

```js
['--styles', '--routing', ['--port', '-p']];
```

** Since v2.0.0 no differences between using one or two middle dash, no differences between --port and --p **

```js
['styles', 'routing', ['port', 'p']];
```

Note that the third config element is an array of strings, it can be used to assign two or more flags to same configuration.
This configuration for _arguments-parser_ will produce this json when we call node with:

> node index.js --skipgit --port 4200 -p 3200 --styles=scss

```json
{
    "skipgit": true,
    "styles": "scss",
    "port": 4200
}
```

> node index.js --skipgit --p 3200 --port 4200 --styles=scss

```json
{
    "skipgit": true,
    "styles": "scss",
    "port": 4200
}
```

**Before v2.0.0 the properties of the object has the exact name of the properties configuration**

> As you can see, the first element of the array (for multiple flags to same configuration) is the key of the result object, and has more height than other flags (for same configuration, in this case "-p" vs "--port" is sended in de node command, the result will be builded with "port" value)

## Other considerations

-   In the previous examples the --style flag value has an equal before the value itself, you can define your values with '=' or with a whitespace.
-   If no value has passed into a parameter, by default equals true

## Remove no config info message

**Since v2.0.0 No message will appear if not set the explicit mode to true.**

If you want to use arguments-parser without config, to remove the warning message create the configuration file with no content. [v2.0.0 - Set explicit mode to false or leave it without configuration]
