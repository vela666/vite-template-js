/**
 * 捕获 async/await 异常
 * @param { Promise } 传进去的请求函数
 * @param { Object } errorExt - 拓展错误对象
 * @return { Promise } 返回一个Promise
 */

export function to(promise, errorExt) {
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
      }

      return [err, undefined]
    })
}
