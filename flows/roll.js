'use strict'
const os = require('os')
const Roll = require('./roll/index.js')


module.exports = (slapp) => {

    slapp.command('/roll', /.*/, (msg, text) => {
        console.log('Command ' + text + ' found' )
        console.log(JSON.stringify(msg))
        try {
            if (msg.body.text == '') {
                msg.respond(":sob Sorry, I didn't understand you.  Try something like 2d6 or d20 or 3d6+4.  See https://github.com/troygoode/node-roll for more advanced examples");
            } else {
                console.log('about to roll ' + text)
                var r = new Roll().roll(text)
                console.log(JSON.stringify(r));
                msg.respond(r.result)
            }
        }
        catch (e) {
            console.log('exception ' + e)
            msg.respond(e)
        }
    })
}