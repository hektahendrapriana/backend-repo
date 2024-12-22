const { onRequest } = require("firebase-functions/v2/https");
import { RequestHandler } from 'express';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { db, authDb, firebaseConfigWeb } from '../config/firebaseConfig';
import { encrypt, decrypt } from '../middleware/utils/encryption';

import { initializeApp } from 'firebase/app';
import { EmailAuthProvider, deleteUser, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword, updateEmail, updatePassword, updateProfile } from "firebase/auth";

const appWebLogin = initializeApp(firebaseConfigWeb);
const auth = getAuth(appWebLogin);

export const getUsers:RequestHandler = async (req: any, res: any) => {
      try {
            const query = db.collection("users")
            const querySnapshot =  await query.get();
            const docs = querySnapshot.docs;
            if( docs.length > 0 )
            {
                  const response = docs.map((doc: any)=>(new User(doc.id, doc.data().displayName, doc.data().email, doc.data().password, doc.data().phone)))
                  return res.status(200).json({message: 'Get All successfully', data: response})
            }
            else
            {
                  return res.status(200).json({message: 'User not found', data: null})
            }
            
      } catch (error) {
            return res.status(500).json()
      }
};

export const getUserById:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id;
      try {
            const doc =  db.collection('users').doc(userId)
            const item = await doc.get()
            const user = item.data()
            if( typeof(user) !== 'undefined' )
            {
                  return res.status(200).json({message: 'Get User By ID successfully',   data: user})
            }
            else
            {
                  return res.status(200).json({message: 'User not found',   data: null})
            }
            
      } catch (error) {
            return res.status(500).send(error)
      }
};

export const createUser:RequestHandler = async (req: any, res: any) => {
      const displayName = (req.body as { displayName:string } ).displayName;
      const email = (req.body as { email:string } ).email;
      const password = (req.body as { password:string } ).password;
      const phone = (req.body as { phone:string } ).phone;
      const id = uuidv4(); 
      const query = db.collection("users")
      const querySnapshot =  await query.get();
      const docs = querySnapshot.docs;
      const response = docs.map((doc)=>(new User(doc.id, doc.data().displayName, doc.data().email, doc.data().password, doc.data().phone)));
      const checkUser = response.filter(function(e) {
            return e.email === email || e.displayName === displayName || e.phone === phone;
      });

      if( checkUser.length > 0 )
      {
            res.status(500).json({message: 'User already exist'});
      }
      else
      {
            const encryptedPassword: string = encrypt(password).toString();
            const newUser = new User(id, displayName, email, encryptedPassword, phone);
            try {
                  await db.collection("users")
                        .doc('/'+ id + '/')
                        .create({
                              id: id,
                              displayName: displayName,
                              email: email,
                              password: encryptedPassword,
                              phone: phone
                        })
                  return res.status(201).json({message: 'User created successfully',   data: newUser})
            } catch (error) {
                  return res.status(500).send(error)
            }
      }
      
};

export const updateUser:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id
      
      const displayName = (req.body as { displayName:string } ).displayName; 
      const email = (req.body as { email:string } ).email;  
      const phone = (req.body as { phone:string } ).phone; 

      try {
            const document = db.collection("users").doc(userId);
            const item = await document.get();
            const user = item.data();
            if( typeof(user) !== 'undefined' )
            {
                  await document.update({
                        displayName: displayName === null || typeof(displayName) === 'undefined' || displayName === '' ? user?.displayName : displayName,
                        email: email === null || typeof(email) === 'undefined' || email === '' ? user?.email : email,
                        phone: phone === null || typeof(phone) === 'undefined' || phone === '' ? user?.phone : phone,
                  })
                  return res.status(200).json({message: 'User Updated successfully', data: { id: userId, displayName: displayName, email: email, phone: phone }})
            }
            else
            {
                  return res.status(200).json({message: 'User not found', data: null})
            }
            
      } catch (error) {
            return res.status(500).json()
      }
};

export const changePassword:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id

      const password = (req.body as { password:string } ).password; 
      if( password === null || typeof(password) === 'undefined' || password === '' )
      {
            return res.status(500).json({message: 'Password Cant be empty'})
      }
      else
      {
            try {
                  const encryptedPassword: string = encrypt(password).toString();
                  const document = db.collection("users").doc(userId);
                  const item = await document.get();
                  const user = item.data();
                  if( typeof(user) !== 'undefined' )
                  {
                        await document.update({
                              password: encryptedPassword,
                        })
                        return res.status(200).json({message: 'Change Pasword successfully', data: { id: userId }})
                  }
                  else
                  {
                        return res.status(200).json({message: 'User not found', data: null})
                  }
            } catch (error) {
                  return res.status(500).json()
            }
      }
};

export const deleteUserById:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id
      try {
            const document = db.collection("users").doc(userId);
            const item = await document.get();
            const deletedItem = item.data()
            if( typeof(deletedItem) !== 'undefined' )
            {
                  await document.delete()
                  return res.status(200).json({message: 'User Deleted successfully',   data: deletedItem})
            }
            else
            {
                  return res.status(200).json({message: 'User not found', data: null})
            }
      } catch (error) {
            return res.status(500).json()
      }
};

// THIS is for database AUTH
export const getListUsersAuth:RequestHandler = onRequest( async(req: any, res: any) => {
      const nextPageToken = req.params.pageToken;
      await authDb.listUsers(1000, nextPageToken).then( async (usersResponse) => {
            if (usersResponse.pageToken)
            {
                  await authDb.listUsers(1000, usersResponse.pageToken).then( async (listUsers) => {
                        return res.status(200).json({message: 'Get All successfully', data: listUsers.users})
                  })
                  .catch((error) => {
                        return res.status(500).json({message: 'User not found',   data: error})
                  });
            }
            else
            {
                  return res.status(200).json({message: 'Get All successfully', data: usersResponse.users})
            }
      })
      .catch((error) => {
            return res.status(500).json({message: 'User not found',   data: error})
      });
});

export const getUserByIdAuth:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id;
      await authDb.getUser(userId).then( async (userResponse) => {
            return res.status(200).json({message: 'Get User By ID successfully',   data: userResponse})
      })
      .catch((error) => {
            return res.status(500).json({message: 'User not found',   data: error})
      });
};

export const updateUserAuth:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id
      
      const displayName = (req.body as { displayName:string } ).displayName; 
      const email = (req.body as { email:string } ).email;  
      const phone = (req.body as { phone:string } ).phone; 

      await authDb.getUser(userId).then( async (userResponse) => {
            const passwordHash: any | undefined = userResponse.passwordHash?.split('password=');
            const password = decrypt(passwordHash[1]);
            await signInWithEmailAndPassword(auth, userResponse.email!, password).then( async (userCredential) => {
                  if( displayName !== null )
                  {
                        await updateProfile(userCredential.user, { displayName: displayName, photoURL: "" } );
                  }

                  if( email !== null )
                  {
                        await updateEmail(userCredential.user, email );
                  }

                  await authDb.updateUser(
                        userId,
                        {
                              displayName: displayName,
                              email: email,
                              phoneNumber: phone
                        }
                  ).then( async () => {
                        return res.status(200).json({message: 'User Updated successfully', data: { id: userId, displayName: displayName, email: email, phone: phone }})
                  })
                  .catch((error) => {
                        return res.status(200).json({message: 'User not found', data: error})
                  });
            })
            .catch((error) => {
                  return res.status(500).json({message: 'Wrong Email or Password', data: error});
            });
      })
      .catch((error) => {
            return res.status(500).json({message: 'User not found',   data: error})
      });
};

export const changePasswordAuth:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id

      const newPassword = (req.body as { password:string } ).password; 

      await authDb.getUser(userId).then( async (userResponse) => {
            const passwordHash: any | undefined = userResponse.passwordHash?.split('password=');
            const password = decrypt(passwordHash[1]);
            await signInWithEmailAndPassword(auth, userResponse.email!, password).then( async (userCredential) => {
                  console.log(userCredential.user)
                  if( newPassword === null || typeof(newPassword) === 'undefined' || newPassword === '' )
                  {
                        return res.status(500).json({message: 'Password Cant be empty'})
                  }
                  else
                  {
                        const newEncryptedPassword = encrypt( newPassword );

                        const credential = EmailAuthProvider.credential(userCredential.user.email!, password);
                        await reauthenticateWithCredential(auth.currentUser!, credential).then(async( responseCreddential) => {
                              console.log(responseCreddential)
                              await updatePassword(auth.currentUser!, newEncryptedPassword).then( async () => {
                                    await authDb.updateUser( userId, { password: newEncryptedPassword } ).then( async () => {
                                          return res.status(200).json({message: 'Change Pasword successfully', data: { id: userId, email: userResponse.email, displayName: userResponse.displayName }})
                                    })
                                    .catch((error) => {
                                          return res.status(200).json({message: 'User not found', data: error})
                                    });
                              })
                              .catch((error) => {
                                    return res.status(200).json({message: 'User not found', data: error})
                              });
                        }).catch((error) => {
                              return res.status(200).json({message: 'User not found', data: error})
                        });
                        
                  }
            })
            .catch((error) => {
                  return res.status(500).json({message: 'Wrong Email or Password', data: error});
            });
      })
      .catch((error) => {
            return res.status(500).json({message: 'User not found',   data: error})
      });
};

export const deleteUserAuthById:RequestHandler = async (req: any, res: any) => {
      const userId = req.params.id
      await authDb.getUser(userId).then( async (userResponse) => {
            const passwordHash: any | undefined = userResponse.passwordHash?.split('password=');
            const password = decrypt(passwordHash[1]);
            await signInWithEmailAndPassword(auth, userResponse.email!, password).then( async (userCredential) => {
                  await deleteUser(userCredential.user).then( async () => {
                        await authDb.deleteUser(userId).then( async () => {
                              return res.status(200).json({message: 'User Deleted successfully',   data: { id: userId, email: userResponse.email, displayName: userResponse.displayName }})
                        })
                        .catch((error) => {
                              return res.status(200).json({message: 'User not found', data: error})
                        });
                  })
                  .catch((error) => {
                        return res.status(200).json({message: 'User not found', data: error})
                  });
            })
            .catch((error) => {
                  return res.status(500).json({message: 'Wrong Email or Password', data: error});
            });
      })
      .catch((error) => {
            return res.status(500).json({message: 'User not found',   data: error})
      });
};