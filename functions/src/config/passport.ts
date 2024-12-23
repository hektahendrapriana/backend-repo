import passport from "passport";
import { Strategy } from "passport-jwt"
import { decrypt } from "../middleware/utils/encryption";
import { db, authDb } from "./firebaseConfig";

const jwtSecret: string = "7D6425FAC26477182B78C8F2F39CE";
/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req: any) => {
  let token = null
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim()
  } else if (req.body.token) {
    token = req.body.token.trim()
  } else if (req.query.token) {
    token = req.query.token.trim()
  }
  if (token) {
    token = decrypt(token)
  }
  return token
}
/**
 * Options object for jwt middlware
 */
const jwtOptions: any = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: jwtSecret
}

/**
 * Login with JWT middleware
 */
const jwtLogin = new Strategy(jwtOptions, async (payload, done) => {
  try{
    const doc =  db.collection('users').doc(payload.data._id)
    const item = await doc.get()
    const user = item.data()
    if( typeof( user ) !== 'undefined' )
    {
      return done(null, user)
    }
    else
    {
      await authDb.getUser(payload.data._id).then( async (userResponse) => {
        return done(null, userResponse)
      })
      .catch((error) => {
            return done(null, false)
      });
    }
  }
  catch (error) {
    return done(null, false)
  }
})

passport.use(jwtLogin)
