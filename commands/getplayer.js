const v = require('./validation')
module.exports = function (keyword, msg, text, say) {

    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setplayer fug hp 99', 1, say, function () {
        v.mustBeUser(msg, keyword, text, say, function () {

            db.getPlayer(text, function (err, player) {
                say(JSON.stringify(player, null, 4))
            })
        })

    })

}