import { RequestHandler } from 'express';
import { User } from '../models/user';
// import { v4 as uuidv4 } from 'uuid';
import { db } from '../index';
import { encrypt } from '../middleware/utils/encryption';
import { generateToken } from '../middleware/auth/generateToken';
import { getRefreshToken } from '../middleware/auth/getRefreshToken';


export const signIn:RequestHandler = async (req: any, res: any) => {
      const email = (req.body as { email:string } ).email;
      const password = (req.body as { password:string } ).password;
      
      try {
            const query = db.collection("users")
            const querySnapshot =  await query.get();
            const docs = querySnapshot.docs;
            const response = docs.map((doc)=>(new User(doc.id, doc.data().displayName, doc.data().email, doc.data().password, doc.data().phone)));
            const checkLogin = response.filter(function(e) {
                  return e.email === email;
            });
            if( checkLogin.length > 0 )
            {
                  if( checkLogin[0].password === encrypt(password) )
                  {
                        const token = generateToken(checkLogin[0]);
                        let data = {
                              token: token,
                              user: {
                                    id: checkLogin[0].id,
                                    displayName: checkLogin[0].displayName,
                                    email: checkLogin[0].email,
                                    phone: checkLogin[0].phone
                              }
                        }
                        res.status(200).json({message: 'Login Success', data: data});
                  }
                  else
                  {
                        res.status(500).json({message: 'Wrong Password'});
                  }
            }
            else
            {
                  res.status(500).json({message: 'Email not found'});
            }
            
      } catch (error) {
            return res.status(500).send(error)
      }
};

export const refreshToken:RequestHandler = async (req: any, res: any) => {
      try {
            await getRefreshToken(req, res);
      } catch (error) {
            return res.status(500).send(error)
      }
};