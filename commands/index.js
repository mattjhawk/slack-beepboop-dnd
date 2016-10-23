'use strict'

function wireupCommand(slapp, keyword, cmd) {
    slapp.command('/' + keyword, /.*/, (msg, text) => {
        try {
            let result = cmd(keyword, msg, text);
            msg.say(result)
        }
        catch (e) {
            msg.say(':sob: Exception::' + e.toString())
        }

    })

    slapp.message('^(' + keyword + ').*', ['direct_mention', 'direct_message'], (msg, text, greeting) => {
        try {
            let result = cmd(keyword, msg, text)
            msg.respond(result);
        }
        catch (e) {
            msg.respond(':sob: Exception:' + e.toString())
        }

    })
}

// list out explicitly to control order
module.exports = (slapp) => {

    wireupKeyword(slapp, 'roll', require('./roll'))

}