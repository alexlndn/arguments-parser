const { readFileSync } = require('fs')
const coolors = require('node-coolors')

function readMapping(){
    try {
        const data = readFileSync(__dirname + './../../config/arguments-parser.json', { flag: 'r', encoding: 'utf8' })
        return data ? JSON.parse(data) : null
    }catch(err){
        console.log(`${coolors.fgCyan(coolors.bright('Warning: '))}${coolors.fgYellow('arguments-parser')} not configured.`)
        console.log(`Please create arguments-parser.json inside config folder in project root folder.`)
        console.log(`Otherwise if you don't want to configure it, please set ${coolors.bright('explicit')} property to false in main configuration.\n`)
        return null
    }
}

const isKey = (str) => {
    if(!str){
        console.log(coolors.fgYellow('No se ha proporcionado la cadena para verificar si es clave o no.'))
    }
    return str && str.startsWith('-')
}

const isCompact = (str) => {
    return (str && str.indexOf('=') > -1)
}

const getKey = (str) => {
    if(!str){
        console.log(coolors.fgYellow('No se ha proporcionado la cadena para obtener la clave.'))
        return
    }
    const index = str.indexOf('=')
    return (index > -1) ? str.slice(0, index).slice(str.lastIndexOf('-') + 1, str.length) : str.slice(str.lastIndexOf('-') + 1, str.length)
}

const getValue = (str) => {
    if(!str){
        console.log(coolors.fgYellow('No se ha proporcionado la cadena para obtener el valor.'))
        return
    }
    const index = str.indexOf('=')
    return str.slice(index + 1, str.length)
}

const processArgs = (config) => {
    const arguments = process.argv.slice(config.offset ? config.offset : 2)
    if(config.onlyParamsArray){
        return arguments
    }
    let processed = {}

    let actualArg

    while(arguments[0] && arguments[0].length){
        if(isKey(arguments[0])){
            actualArg = arguments.shift()
            if(isCompact(actualArg)){
                let val = getValue(actualArg)
                actualArg = getKey(actualArg)
                processed[actualArg] = []
                processed[actualArg].push(val)
            }else{
                actualArg = getKey(actualArg)
                processed[actualArg] = []
            }

        }else{
            let actualValue = arguments.shift()
            if(!processed[actualArg]){
                processed[actualArg] = []
            }
            processed[actualArg].push(actualValue)
        }
    }

    // parse values
    for(let key of Object.keys(processed)){
        processed[key] = parseValue(processed[key])
        if(processed[key].length === 0){
            processed[key].push(true)
        }
        if(!config.keepAsArray){
            if(processed[key].length === 1){
                processed[key] = processed[key][0]
            }
        }
    }
    return processed
}

function parseValue(value){
    value.forEach((val, index) => {
        if(!isNaN(parseInt(val, 10))){
            value[index] = parseInt(val)
            return
        }
        switch(val){
            case 'true':
                value[index] = true
                break
            case 'false':
                value[index] = false
        }
    })
    return value
}

function argumentsParser(config) {
    const args = processArgs(config)
    if(config.onlyParamsArray){
        return args
    }
    const mapping = (config && config.explicit) ? readMapping() : null
    let result = {}
    if(mapping){
        for(let map of mapping){
            let key
            if(typeof(map) === 'object'){
                const baseKey = getKey(map[0])
                for(let key of map){
                    key = getKey(key)
                    let keyValue = args[key]
                    if(keyValue){
                        result[baseKey] = keyValue
                    }
                }
                // establecer el base
                let keyValue = args[baseKey]
                if(keyValue){
                    result[baseKey] = keyValue
                }
            }else if(typeof(map) === 'string'){
                key = getKey(map)
                let keyValue = args[key]
                if(keyValue)
                    result[key] = keyValue
            }
        }
    }else{
        result = args
    }
    return result
}

module.exports = argumentsParser
