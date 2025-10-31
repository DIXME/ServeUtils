const ws = require("./websocket.cjs")
const config = require("./config.json")
const express = require("express")
const http = require("http")
const fs = require("fs")
const middleware = require("./MiddleWare/middleware.js").bundle()
console.log(middleware)

const app = express()
const server = http.createServer(app)

app.use(express.static(__dirname+'/payload'))

app.use('/admin', localOnly, express.static(__dirname+"/admin"))
// public is just for everyone, we could restrict this to a user or somthing
app.use('/public', express.static(__dirname+'/public'))
app.use('/view', function(req, res, next){
    const path = __dirname+'/public'+req.path
    if(!fs.existsSync(path)){
        res.status(404).send(`File [@${path}] Not Found`)
    }
    if(req.path.endsWith(".wasm")){
        // wasm file
        // loader, this is just code gen i guess to make it easier
                res.send(`
            <script>
            (async () => {
                try {
                    const bytes = await (await fetch("/public/${req.path}")).arrayBuffer();

                    const importObject = {
                        env: {
                            memory: new WebAssembly.Memory({ initial: 1 }),
                            print: (ptr, len) => {
                                const bytesView = new Uint8Array(importObject.env.memory.buffer, ptr, len);
                                const string = new TextDecoder('utf8').decode(bytesView);
                                console.log(string);
                                document.body.innerHTML += "<pre>" + string + "</pre>";
                            }
                        }
                    };

                    const results = await WebAssembly.instantiate(bytes, importObject);

                    // Expose memory for WASM to use
                    importObject.env.memory = results.instance.exports.memory || importObject.env.memory;

                    // Call exported function (e.g., main)
                    if (results.instance.exports.main) {
                        results.instance.exports.main();
                        document.body.innerHTML += "<pre>[+] WASM Loaded & Executed!</pre>";
                    } else {
                        document.body.innerHTML += "<pre>[!] WASM Loaded but no 'main' function found.</pre>";
                    }

                } catch (err) {
                    console.error("[-] Failed Loading Wasm! err [" + err + "]");
                    document.body.innerHTML += "<pre>[-] Failed Loading WASM: " + err + "</pre>";
                }
            })()
            </script>
        `);
    } else if (req.path.endsWith(".wat")){

    }
    else {
        res.send("no viewer for this file, sorry: "+file)
    }
    next();
}, express.static(__dirname+'/public'))

app.use('/compile', function(req, res, next){
    // Comp Shit

    next();
}, express.static(__dirname+"/public"))

server.on("upgrade", (req, socket, head) => {
    // make ws be hosted on /ws on the same port
    if (req.url === "/ws") {
        ws.wss.handleUpgrade(req, socket, head, (s) => {
            ws.wss.emit("connection", s, req);
        });
    } else {
        socket.destroy(); // ignore other upgrade requests
    }                                                                                                                                                                                                                                                                                                                                                                                                      
});

app.get("/ip", (req, res) => {
    res.json(getI(req))
})

app.get("/admin/pan", (req, res) => {
    res.sendFile(__dirname+"/admin/dashboard.html");
})

app.get("/q/:hostname", async (req, res) => {
    const hostname = req.params.hostname
    const url = `https://1.0.0.1/dns-query?name=${encodeURIComponent(hostname)}&type=A`
    console.log(url)
    fetch(url, { headers: { Accept: 'application/dns-json' }}).then(async (r) => {
        const json = await r.json()
        res.json(json)
    }).catch(err => {
        console.error(err)
        res.send(err)
    })
})

app.get('/payload', (req, res) => {
    res.sendFile(__dirname+"/payload/payload.html")
})

server.listen(80)