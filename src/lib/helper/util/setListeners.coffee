firstCharToLowerCase = require "./firstCharToLowerCase"

###
# Set listeners to a target object
#
# @param Function target
# @param Object listeners
# @param any args...
###
setListeners = (target, listeners, args...) ->
  for name, listener of listeners
    name = firstCharToLowerCase name[2..] if name.startsWith "on"

    target.on name, listener args...

  return target

module.exports = setListeners
