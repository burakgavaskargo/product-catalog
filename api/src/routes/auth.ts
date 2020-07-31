import expressRouter from 'express-promise-router';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from 'passport';

const router = expressRouter();

router.get('/', authenticate('jwt', {session: false}), getCurrentUser);

router.post('/', login);

// not for public consumption, exported for testing
export async function getCurrentUser(req: Request, res: Response) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).end();
  }
}

// not for public consumption, exported for testing
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({message: 'Invalid email / password'});
  }

  // TODO: use database
  // const user = await db.getUser({email, password});
  const user = {
    id: 1,
    email
  };
  if (!user) {
    return res.status(401).json({message: 'Invalid email / password'});
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('process.env.JWT_SECRET is undefined');
  }
  const token = jwt.sign(user, secret, {expiresIn: '6h'});
  res.json({user, token});
}

export default router;