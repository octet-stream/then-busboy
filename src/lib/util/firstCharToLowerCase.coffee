toLowerCase = (str) -> String::toLowerCase.call str

firstCharToLowerCase = (str) -> "#{toLowerCase str.charAt 0}#{str[1..]}"

module.exports = firstCharToLowerCase
