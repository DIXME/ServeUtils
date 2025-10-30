type tag = string // a string to identify a client format is as follows: ipaddr:port
// to be clear the port refreced in the tag is NOT 80 or 443 its the port the os uses for uniqe connections
interface WebsocketAdminAddClient {
    type: "Add",
    data: {
        tag: tag
        ip: string
    }
}

interface WebsocketAdminRemoveClient {
    type: "Sub",
    data: {
        tag: tag
    }
}

interface WebsocketAdminInitalizeClients {
    type: "Init",
    data: {
        users: Array<tag> // array of tags and it can send it back to the server to tell it to do somthing to it, meaning its just a form of id
    }
}