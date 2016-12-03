const r = require('./roll/index.js')
const mechanics = require('./mechanics.js')
function getWeapon(player, params) {
    let weapon = null
    let weaponName = null
    // did the supply params?
    if (params && params.length > 0 && params[0]) {
        // did they match a weapon:
        if (player && player.weapons && player.weapons[params[0]]) {
            weapon = player.weapons[params[0]]

        } else if (player && player.weapons) {
            let matchingWeaponKeys = Object.keys(player.weapons).filter(w => {
                return w.startsWith(params[0])
            })
            if (matchingWeaponKeys.length == 1) {
                weapon = player.weapons[matchingWeaponKeys[0]]
            }
        }

        params.slice(1)
    }

    // do they have a weapon yet?
    if (!weapon) {
        // what weapon did they use last time?
        if (player && player.lastWeaponAttackedWith && player.weapons && player.weapons[player.lastWeaponAttackedWith]) {
            weapon = player.weapons[player.lastWeaponAttackedWith]
        }
    }

    // do they have a weapon yet?
    if (!weapon) {
        weapon = {}
        weapon.name = 'unarmed'
        weapon.attack = '1d20'
        weapon.modifier = 'strength'
        weapon.damage = '1d1'
    }
    // add weapon modifiers
    weapon.attackmodifier == weapon.attackmodifier || weapon.modifier
    weapon.damagemodifier == weapon.damagemodifier || weapon.modifier


    return weapon
}

module.exports.attack = function (msg, params, say) {
    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))
    let user = msg.body["user_name"].toLowerCase()

    db.getPlayer(user, function (err, player) {
        if (err) throw err
        if (player) {
            console.log('got player a ' + user)
            console.log('got playerj a ' + JSON.stringify(player))
            let weapon = getWeapon(player, params)
            console.log('got playerj ab ' + JSON.stringify(player))
            console.log('got weapon ' + weapon.name)

            rollText = `${weapon.attack}+${mechanics.getProficiency(player)}+${mechanics.getModifier(player, weapon.attackmodifier)}`
            console.log('got rolltext ' + rollText)
            console.log('got playerj ac ' + JSON.stringify(player))
            let rollDesc = `${weapon.attack}+${mechanics.getProficiency(player)}(player proficiency bonus for level ${player.level}+${mechanics.getModifier(player, weapon.attackmodifier)}`
            console.log('got rollDesc ' + rollDesc)
            let flavour = ``
            let roll = new r().roll(rollText)
            if (params && params.length > 0) {
                flavour = ` ${params.join(' ')}`
            }
            console.log('got flavour ' + flavour)
            let result = `@${user} made an attack roll (${weapon.name}${flavour}) of _${rollText}_ for and got *${roll.result}* (dice rolled were ${JSON.stringify(roll.rolled)})`

            console.log('get resuilt' + result)
            if (weapon.name != player.lastWeaponAttackedWith) {
                console.log('writing back')
                db.setPlayer(user, user, 'set', ['lastWeaponAttackedWith', weapon.name], Date.now(), function (err, settedplayer) {
                    console.log('writing returning')
                    return say(result)
                })
            } else {
                console.log('returning no write')
                return say(result)
            }
        }

    })
}

module.exports.damage = function (msg, params, say) {
    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))
    let user = msg.body["user_name"]

    db.getPlayer(user, function (err, player) {
        if (err) throw err
        if (player) {
            let weapon = getWeapon(player, [player.lastWeaponAttackedWith])

            let mechanics = require('./mechanics.js')
            rollText = `${weapon.damage}+${mechanics.getModifier(player, weapon.damagemodifier)}`

            let flavour = ``
            let roll = new r().roll(rollText)
            if (params && params.length > 0) {
                flavour = ` ${params.join(' ')}`
            }
            let result = `@${user} made an damage roll (${weapon.name}${flavour}) of  _${rollText}_ for and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)})`

            return say(result)

        }
    })
}