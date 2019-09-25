const { readFileSync } = require('fs')

/**
 * HELPER: CONSOLE COLORS
 * @author alexlndn <alex08lta@gmail.com>
 * 
 */
class ConsoleColors {
    static get reset() {
        return "\x1b[0m";
    }
    static get bright() {
        return "\x1b[1m";
    }
    static get dim() {
        return "\x1b[2m";
    }
    static get underscore() {
        return "\x1b[4m";
    }
    static get blink() {
        return "\x1b[5m";
    }
    static get reverse() {
        return "\x1b[7m";
    }
    static get hidden() {
        return "\x1b[8m";
    }
    static get fgBlack() {
        return "\x1b[30m";
    }
    static get fgRed() {
        return "\x1b[31m";
    }
    static get fgGreen() {
        return "\x1b[32m";
    }
    static get fgYellow() {
        return "\x1b[33m";
    }
    static get fgBlue() {
        return "\x1b[34m";
    }
    static get fgMagenta() {
        return "\x1b[35m";
    }
    static get fgCyan() {
        return "\x1b[36m";
    }
    static get fgWhite() {
        return "\x1b[37m";
    }
    static get bgBlack() {
        return "\x1b[40m";
    }
    static get bgRed() {
        return "\x1b[41m";
    }
    static get bgGreen() {
        return "\x1b[42m";
    }
    static get bgYellow() {
        return "\x1b[43m";
    }
    static get bgBlue() {
        return "\x1b[44m";
    }
    static get bgMagenta() {
        return "\x1b[45m";
    }
    static get bgCyan() {
        return "\x1b[46m";
    }
    static get bgWhite() {
        return "\x1b[47m";
    }
}

function readMapping(){
    try {
        const data = readFileSync(__dirname + '/../../config/arguments-parser.json', { flag: 'r', encoding: 'utf8' })
        return data ? JSON.parse(data) : null
    }catch(err){
        console.log('------------------------------------------------------------------------------------')
        console.log(`| ${ConsoleColors.fgCyan}Info:${ConsoleColors.reset} ${ConsoleColors.fgYellow}arguments-parser${ConsoleColors.reset} not configured.                                           |`)
        console.log(`| Please create arguments-parser.json inside config folder in project root folder. |${ConsoleColors.reset}`)
        console.log('------------------------------------------------------------------------------------')
        return null
    }
}

const processArgs = () => {
    const arguments = process.argv.slice(2)
    let processed = []
    for(let i = 0 ; i < arguments.length ; i++){
        let compact = arguments[i].indexOf('=') > 0
        if( !compact ){
            if(arguments[i + 1] === undefined){
                arguments[i] = `${arguments[i]}=true`
            }else if(!arguments[i + 1].startsWith('-')){
                arguments[i] = `${arguments[i]}=${arguments[i+1]}`
                arguments.splice(i + 1, 1)
            }else{
                arguments[i] = `${arguments[i]}=true`
            }
        }
        let arg = arguments[i].split('=')
        let key = arg[0]
        let value = arg[1]
        processed.push([key, value])
    }
    return processed
}

function parseFinal(preProcessedJson){
    for(let key in preProcessedJson){
        if(!isNaN(parseInt(preProcessedJson[key], 10))){
            preProcessedJson[key] = parseInt(preProcessedJson[key])
            continue
        }
        switch(preProcessedJson[key]){
            case 'true':
                preProcessedJson[key] = true
                break
            case 'false':
                preProcessedJson[key] = false 
        }
    }
    return preProcessedJson
}

function argumentsParser() {
    const args = processArgs()
    const mapping = readMapping()
    let result = {}
    if(mapping){
        for(let map of mapping){
            let key
            if(typeof(map) === 'object'){
                const baseKey = map[0]
                for(let key of map){
                    let keyValue = args.filter( arg => arg[0] === key)[0]
                    if(keyValue && keyValue[0].length > 0){
                        result[baseKey] = keyValue[1]
                    }
                }
                // establecer el base
                let keyValue = args.filter( arg => arg[0] === baseKey)[0]
                if(keyValue && keyValue[0].length > 0){
                    result[baseKey] = keyValue[1]
                }
            }else if(typeof(map) === 'string'){
                key = map
                let keyValue = args.filter( arg => arg[0] === key )[0]
                if(keyValue && keyValue[0].length > 0)
                    result[key] = keyValue[1]
            }
        }
    }else{
        args.forEach( arg => {
            result[arg[0]] = arg[1]
        })
    }
    return parseFinal(result)
}

module.exports = argumentsParser
