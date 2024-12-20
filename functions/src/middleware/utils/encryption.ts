import * as crypto from "crypto";
const secret: string = "7D6425FAC26477182B78C8F2F39CE";
const algorithm = "aes-256-cbc"
const key = crypto.scryptSync(secret!, 'salt', 32)
const iv = Buffer.alloc(16, 0)

/**
 * Encrypts text
 * @param {string} text - text to encrypt
 */
const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return encrypted.toString();
}

/**
 * Decrypts text
 * @param {string} text - text to decrypt
 */
const decrypt = (text: string): string => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(text, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted.toString();
}

export { encrypt, decrypt }
