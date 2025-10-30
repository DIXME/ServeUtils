const wsp = require("ws")
const wss = new wsp.Server({noServer: true})
const config = require("./config.json")
let clients = {}

function tagm(o){
    return `${o._socket.remoteAddress.replace("::1", "localhost")}:${o._socket.remotePort}`
}

// init list (prolly wont be any tbh)
for (const client of wss.clients){
    var tag = tagm(client)
    clients[tag] = client
    // tag: clientObject
}

function find(tag){
    return Object.keys(tag).indexOf(tag)
}

wss.on('connection', function(ws){
    const tag = tagm(ws)
    const ip = ws._socket.remoteAddress.replace("::1", "localhost")
    console.log(`[+] New Connection [${tag}]🆕`)
    clients[tag] = ws
    // broadcast to admin panel
    ws.send(JSON.stringify({
        type: 'Add',
        data: {tag: tag, ip: ip}
    }))
    ws.on("close", function(){
        console.log(`[-] Connection [${tag}] Is Dead🥲`)
        delete clients[tag]
        // broadcast to admin panel
        ws.send(JSON.stringify({
            type: 'Sub',
            data: {tag: tag}
        }))
    })
    ws.on('message', function(message){
        console.log(`[+] New Message [${message}] From [${tag}]🆕`)
        require('dotenv').config({"path":__dirname+"/admin/.env"})
        if(message == process.env.KEY && ip == "localhost"){
            // authed
            let tags = Object.keys(clients)
            ws.send(JSON.stringify({
                type: "Init",
                data: {users: tags}
            }))
        } else {
            if(!config.testing){
                console.warn(`[!] Somone [${tag}] just tried to login that was not admin with the password [${message}]`)
                console.log("[+] Now shutting down WSS")
                wss.close()
            } else {
                console.log(`[!] Wanring: Somone on localhost tried to login to admin panel, to make the websocket close when this happens edit the config file and change testing to true`)
            }
            
        }
        // info drop we should put this somwhere proubly a discord webhook & to the dashboard
    })
})

module.exports = {wsp, wss}