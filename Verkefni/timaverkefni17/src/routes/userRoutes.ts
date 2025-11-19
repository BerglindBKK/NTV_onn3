import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById, UserRole, UserTokenPayload } from '../models/userModel';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw Error('Missing JWT_SECRET in environment');
}

router.get('/me', async (request: Request, response: Response) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split('Bearer ')[1];

  if (!token) {
    return response.status(400).json({ error: 'Aðgangur óheimill. Ekkert token fannst.' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as unknown as UserTokenPayload;

    const user = await findUserById(decodedToken.sub);

    if (!user) {
      return response.status(404).json({ error: 'Notandi fannst ekki' });
    }

    const { password_hash, ...rest } = user;
    return response.status(200).json({ user: rest });
  } catch (e) {
    response.status(403).json({ error: 'Aðgangur óheimill: Ógilt token...' });
  }
});

export default router;
