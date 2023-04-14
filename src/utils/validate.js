/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validRole(role) {
  if (role === undefined) {
    return false
  }
  return /^[A-Z_]+$/.test(role)
}

export function validNull(str) {
  if (str === undefined) {
    return false
  }
  return /^[\s\S]*.*[^\s][\s\S]*$/.test(str)
}

export function validPassword(password) {
  if (password === undefined || password.length < 6 || password.length > 16) {
    return false
  }
  return true
}

export function validNumber(number) {
  if (number === undefined) {
    return false
  }

  return /^\d+$/.test(number)
}
