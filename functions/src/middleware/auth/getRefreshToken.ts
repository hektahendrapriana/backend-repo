import { getUserFromToken } from "./getUserFromToken";
import { handleError } from "../utils/handleError";
import { generateToken } from "./generateToken";

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getRefreshToken = async (req: any, res: any) => {
  try {
    const tokenEncrypted: string = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    let user = await getUserFromToken(tokenEncrypted);
    const data = generateToken(user);
    res.status(200).json(data)
  } catch (error) {
    handleError(res, error)
  }
}

export { getRefreshToken }
    