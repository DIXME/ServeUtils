const fs = require("fs")
const suffix = ".middleware.js"

function bundle(){
    // [name] = function
    // ik it dont make sense but javascript pareses it back to kv
    // even tho i dont look like kv it is
    // for some reason functions with names are just annon function with proptery names in a object
    // ex {functionName: () => console.log("Hello, World!")}
    const list = fs.readdirSync(__dirname).map(fileName => {return Object.values(require('./'+fileName))}).flat(Infinity)
    var object = {}
    for (const func of list){
        Object.assign(object,func)
    }
    return object
}

module.exports = {bundle}