import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, changePassword, deleteUserById, deleteUserAuthById, changePasswordAuth, updateUserAuth, getUserByIdAuth, getListUsersAuth } from '../controller/user';
import "../config/passport"
import passport from "passport";
import { register } from '../controller/auth';
const requireAuth = passport.authenticate('jwt', {
  session: false,
})

const userRoutes = Router();

userRoutes.post('/users', createUser);
userRoutes.get('/users', requireAuth, getUsers);
userRoutes.get('/users/:id', requireAuth, getUserById);
userRoutes.put('/users/:id', requireAuth, updateUser);
userRoutes.put('/users/changepassword/:id', requireAuth, changePassword);
userRoutes.delete('/users/:id', requireAuth, deleteUserById);

userRoutes.post('/adminusers/web', register);
userRoutes.get('/adminusers/web', requireAuth, getListUsersAuth);
userRoutes.get('/adminusers/web/:id', requireAuth, getUserByIdAuth);
userRoutes.put('/adminusers/web/:id', requireAuth, updateUserAuth);
userRoutes.put('/adminusers/web/changepassword/:id', requireAuth, changePasswordAuth);
userRoutes.delete('/adminusers/web/:id', requireAuth, deleteUserAuthById);

export default userRoutes;