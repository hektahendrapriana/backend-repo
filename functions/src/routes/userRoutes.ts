import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, changePassword, deleteUser } from '../controller/user';
import "../config/passport"
import passport from "passport";
const requireAuth = passport.authenticate('jwt', {
  session: false,
  
})

const userRoutes = Router();

userRoutes.post('/users', createUser);
userRoutes.get('/users', requireAuth, getUsers);
userRoutes.get('/users/:id', requireAuth, getUserById);
userRoutes.put('/users/:id', requireAuth, updateUser);
userRoutes.put('/users/changepassword/:id', requireAuth, changePassword);
userRoutes.delete('/users/:id', requireAuth, deleteUser);

export default userRoutes;