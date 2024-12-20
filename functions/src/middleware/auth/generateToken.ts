import jwt from "jsonwebtoken";
import { encrypt } from "../utils/encryption";

/**
 * Generates a token
 * @param {Object} user - user object
 */

const generateToken = (user: any) => {
  try {
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    const jwtExp = process.env.JWT_EXPIRATION_IN_MINUTES;
    const expiration = Math.floor(Date.now() / 1000) + 60 * parseInt(jwtExp!);

    return encrypt(
      jwt.sign(
        {
          data: {
            _id: user.id,
            _displayName: user.displayName,
            _phone: user.phone,
            _email: user.email
          },
          exp: expiration
        },
        jwtSecret!
      )
    )
  } catch (error) {
    throw error
  }
}

export { generateToken }
