const ws = require("./websocket.cjs")
const express = require("express")
const http = require('http')

const app = express()
const server = http.createServer(app)

app.use(express.static(__dirname+'/payload'))

function getI(req){
    return {
        ip: req.socket.remoteAddress.replace("::1", "localhost"),
        port: req.socket.remotePort
    }
}

function localOnly(req, res, next) {
  const ip = getI(req).ip
  const isLocal = ip === "localhost"

  if (!isLocal) {
    return res.status(403).send("Access denied.");
  }
  next();
}

app.use('/admin', localOnly, express.static(__dirname+"/admin"))

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