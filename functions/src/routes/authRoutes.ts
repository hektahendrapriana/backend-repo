import { Router } from 'express';
import { register, signInAuth, signIn, refreshToken } from '../controller/auth';

const authRoutes = Router();

authRoutes.post('/login', signIn);
authRoutes.post('/signin', signInAuth);
authRoutes.post('/register', register);
authRoutes.post('/refresh-token', refreshToken);
authRoutes.post('/refresh-token', refreshToken);

export default authRoutes;