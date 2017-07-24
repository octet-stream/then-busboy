firstCharToLowerCase = require "./firstCharToLowerCase"

###
# Set listeners to a busboy object
#
# @param Function busboy
# @param Object listeners
# @param object options
# @param function fulfill
#
# @return Busboy
###
setListeners = (busboy, listeners, options, fulfill) ->
  for own name, listener of listeners when not name in ["onEnd", "end"]
    name = firstCharToLowerCase name[2..] if name.startsWith "on"

    busboy.on name, listener options, fulfill

  return busboy

module.exports = setListeners
