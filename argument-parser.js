const { readFile } = require('fs')

async function readMapping(){
    try {
        let prom = await new Promise( (resolve, reject) => {
            readFile(__dirname + '/../parserConfig/config.json', { flag: 'r', encoding: 'utf8' }, (err, data) => {
                if(err) reject(err)
                resolve(data)
            })
        })
        return prom ? JSON.parse(prom) : null
    }catch(err){
        console.log('argParser not configured. Please create config.json inside parserConfig in project root folder.')
        return null
    }
}

const processArgs = () => {
    const arguments = process.argv.slice(2)
    let processed = []
    for(let i = 0 ; i < arguments.length ; i++){
        let compact = arguments[i].indexOf('=') > 0
        if( !compact ){
            if(!arguments[i + 1].startsWith('-')){
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

async function argumentParser() {
    const args = processArgs()
    const mapping = await readMapping()
    let result = {}
    if(mapping){
        for(let map of mapping){
            let key
            if(typeof(map) === 'object'){
                for(let key of map){
                    let keyValue = args.filter( arg => arg[0] === key)[0]
                    if(keyValue && keyValue[0].length > 0)
                        result[key] = keyValue[1]
                }
            }else if(typeof(map) === 'string'){
                key = map
                let keyValue = args.filter( arg => arg[0] === key )[0]
                if(keyValue && keyValue[0].length > 0)
                    result[key] = keyValue[1]
            }
        }
    }else{
        arguments.forEach( (val, index) => {
            console.log(`${index}: ${val}`)
        })
    }
    console.log(result)
}

module.exports = argumentParser
