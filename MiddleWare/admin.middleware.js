const express = require("express")
const admins = require("../config.json").adminIPS

/**
 * Description placeholder
 *
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function isAdmin(req, res, next){
    const ip = getI(req).ip

    admins.forEach(admin_ip => {
        if(admin_ip == ip) {
            console.log(`[+] Admin: [${ip}], has logged in`)
            next();
            return;
        }
    })
    // dose not go to next middleware function!
    console.log(`[-] User: [${ip}] tried to log in as admin, FAILED`)
    return res.status(403).send("Access denied.")
}

module.exports = {isAdmin}