// 获取对象的数据类型字符串
const getType = (obj) => Object.prototype.toString.call(obj)

// 判断数据是不是布尔
export function isBoolean(val) {
  return getType(val) === '[object Boolean]'
}

// 判断是不是DOM数据类型
export function isDOMStringMap(val) {
  return getType(val) === '[object DOMStringMap]'
}

// 判断函数类型
export function isFunction(fn) {
  return getType(fn) === '[object Function]'
}

// 判断字符串类型
export function isString(str) {
  return getType(str) === '[object String]'
}

// 判断是否是合法数字类型
export function isNumber(num) {
  return getType(num) === '[object Number]'
}

// 判断对象类型
export function isObject(obj) {
  return getType(obj) === '[object Object]'
}

// 判断 HtmlElement
export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}
