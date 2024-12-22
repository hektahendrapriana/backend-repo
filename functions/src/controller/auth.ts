import { RequestHandler } from 'express';
import { User } from '../models/user';
import { db, authDb, firebaseConfigWeb } from '../config/firebaseConfig';
import { encrypt } from '../middleware/utils/encryption';
import { generateToken } from '../middleware/auth/generateToken';
import { getRefreshToken } from '../middleware/auth/getRefreshToken';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const appWebLogin = initializeApp(firebaseConfigWeb);
const auth = getAuth(appWebLogin);

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
                        return res.status(200).json({message: 'Login Success', data: data});
                  }
                  else
                  {
                        return res.status(500).json({message: 'Wrong Password'});
                  }
            }
            else
            {
                  return res.status(500).json({message: 'Email not found'});
            }
      } catch (error) {
            return res.status(500).send(error)
      }
};

export const signInAuth:RequestHandler = async (req: any, res: any) => {
      const email = (req.body as { email:string } ).email;
      const password = (req.body as { password:string } ).password;
      
      await signInWithEmailAndPassword(auth, email, password).then( async (userCredential) => {
            const user = userCredential.user;
            await authDb.getUserByEmail(user.email!).then( async (userResponse) => {
                  const passwordHash: any | undefined = userResponse.passwordHash?.split('password=');
                  if( passwordHash[1] === encrypt(password) )
                  {
                        const newUser = new User(userResponse.uid, userResponse.displayName!, email, passwordHash[1], userResponse.phoneNumber!);
                        const token = generateToken(newUser);
                        let data = {
                              token: token,
                              accessToken: (await user.getIdTokenResult()).token,
                              user: {
                                    id: user.uid,
                                    displayName: userResponse.displayName,
                                    email: user.email,
                                    phone: userResponse.phoneNumber
                              }
                        }
                        return res.status(200).json({message: 'Login Success', data: data});
                  }
                  else
                  {
                        return res.status(500).json({message: 'Wrong Password'});
                  }
                  
            })
            .catch((error) => {
                  return res.status(500).json({message: 'Email not found'});
            });
      })
      .catch((error) => {
            return res.status(500).json({message: 'Wrong Email or Password'});
      });
};

export const register:RequestHandler = async (req: any, res: any) => {
      const displayName = (req.body as { displayName:string } ).displayName;
      const email = (req.body as { email:string } ).email;
      const password = (req.body as { password:string } ).password;
      const encryptedPassword: string = encrypt(password).toString();
      const phone = (req.body as { phone:string } ).phone;

      await createUserWithEmailAndPassword(auth, email, password).then( async (userCredential) => {
            const user = userCredential.user;
            await authDb.getUserByEmail(email).then((checkEmail) => {
                  return res.status(500).send({message: 'Email already registered', data: checkEmail})
            }).catch( async (error) => {
                  await authDb.getUserByPhoneNumber(phone).then((checkPhone) => {
                        return res.status(500).send({message: 'Phone already registered', data: checkPhone})
                  }).catch( async (error) => {
                        await authDb.createUser({
                              uid: user.uid,
                              email: email,
                              emailVerified: true,
                              phoneNumber: phone,
                              password: encryptedPassword,
                              displayName: displayName,
                              disabled: false,
                        }).then( async (userResponse) => {
                              const newUser = new User(userResponse.uid, displayName, email, encryptedPassword, phone);
                              const token = generateToken(newUser);
                              let data = {
                                    token: token,
                                    accessToken: (await user.getIdTokenResult()).token,
                                    user: {
                                          id: userResponse.uid,
                                          displayName: displayName,
                                          email: email,
                                          phone: phone
                                    }
                              }
                              return res.status(201).json({message: 'User created successfully',   data: data})
                        }).catch((error) => {
                              return res.status(500).send(error)
                        });
                  });
            });
      }).catch( async (error) => {
            await signInWithEmailAndPassword(auth, email, password).then( async (userCredential) => {
                  const user = userCredential.user;
                  await authDb.getUserByEmail(email).then((checkEmail) => {
                        return res.status(500).send({message: 'Email already registered', data: checkEmail})
                  }).catch( async (error) => {
                        await authDb.getUserByPhoneNumber(phone).then((checkPhone) => {
                              return res.status(500).send({message: 'Phone already registered', data: checkPhone})
                        }).catch( async (error) => {
                              await authDb.createUser({
                                    uid: user.uid,
                                    email: email,
                                    emailVerified: true,
                                    phoneNumber: phone,
                                    password: encryptedPassword,
                                    displayName: displayName,
                                    disabled: false,
                              }).then(async(userResponse) => {
                                    const newUser = new User(userResponse.uid, displayName, email, encryptedPassword, phone);
                                    const token = generateToken(newUser);
                                    let data = {
                                          token: token,
                                          accessToken: (await user.getIdTokenResult()).token,
                                          user: {
                                                id: userResponse.uid,
                                                displayName: displayName,
                                                email: email,
                                                phone: phone
                                          }
                                    }
                                    return res.status(201).json({message: 'User created successfully',   data: data})
                              }).catch((error) => {
                                    return res.status(500).send(error)
                              });
                        });
                  });
            })
            .catch((error) => {
                  return res.status(500).json({message: 'Wrong Email or Password'});
            });
      });
};

export const refreshToken:RequestHandler = async (req: any, res: any) => {
      try {
            await getRefreshToken(req, res);
      } catch (error) {
            return res.status(500).send(error)
      }
};