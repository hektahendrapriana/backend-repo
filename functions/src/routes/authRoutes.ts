import { Router } from 'express';
import { signIn, refreshToken } from '../controller/auth';

const authRoutes = Router();

authRoutes.post('/login', signIn);
authRoutes.post('/refresh-token', refreshToken);

export default authRoutes;