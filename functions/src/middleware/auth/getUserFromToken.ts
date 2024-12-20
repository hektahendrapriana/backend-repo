import jwt from "jsonwebtoken";
import { decrypt } from "../utils/encryption";
import { buildErrObject } from "../utils/buildErrObject";

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserFromToken = (token: string) => {
  return new Promise((resolve, reject) => {
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    const decrypted: string = decrypt(token);
    jwt.verify(decrypted, jwtSecret!, (err: any, decoded: any) => {
      if (err) {
        reject(buildErrObject(409, 'BAD_TOKEN'))
      }
      resolve(decoded.data)
    })
  })
}

export { getUserFromToken }
