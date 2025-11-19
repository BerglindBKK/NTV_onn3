import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  createUser,
  CreateUser,
  findUserByEmail,
  User,
  UserTokenPayload,
} from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw Error('Missing JWT_SECRET in environment');
}

export const signup = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return response.status(400).json({
      error: 'Netfang og/eða lykilorð vantar',
    });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return response.status(400).json({
        error: 'Notandi þegar til með þetta netfang',
      });
    }

    const newUser: CreateUser = {
      email,
      password_hash: password, // BANNAÐ.
      role: 'user',
    };

    const createdUser = await createUser(newUser);

    response.status(201).json(createdUser);
  } catch (e) {
    console.log('Villa við nýskráningu', e);
    response.status(500).json({ error: 'Eitthvað fór úrskeiðis' });
  }
};

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return response.status(400).json({
      error: 'Netfang og/eða lykilorð vantar',
    });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || user.password_hash !== password) {
      return response.status(401).json({ error: 'Rangt netfang eða lykilorð.' });
    }

    const payload: UserTokenPayload = {
      sub: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h',
    });

    response.json({ token });
  } catch (e) {
    console.log('Villa við innskráningu', e);
    response.status(500).json({ error: 'Eitthvað fór úrskeiðis' });
  }

  response.status(200).json({ dude: 'sweet' });
};
