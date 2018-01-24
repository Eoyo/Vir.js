/**
 * @example str = "api/query/index.js"
 */

function getLastWord (str: string) {
  const strs = str.split('/')
  return strs[strs.length - 1]
}

const str = {
  getLastWord
}

export {
  str
}
