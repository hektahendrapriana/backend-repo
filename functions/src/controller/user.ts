import { RequestHandler } from 'express';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../index';
import { encrypt } from '../middleware/utils/encryption';


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

export const deleteUser:RequestHandler = async (req: any, res: any) => {
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