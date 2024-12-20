import { buildErrObject } from "./buildErrObject"
/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {string} message - message
 */
const itemNotFound = (err: any = {}, item: any = {}, message: string = 'NOT_FOUND') => {
  return new Promise<void>((resolve, reject) => {
    if (err) {
      return reject(buildErrObject(203, err.message))
    }
    if (!item) {
      return reject(buildErrObject(204, message))
    }
    resolve();
  })
}

export { itemNotFound }
