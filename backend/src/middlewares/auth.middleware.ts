import { Request, RequestHandler } from 'express';
import { auth } from '../lib/auth';
import { prisma } from '../lib/prisma';

export enum Role {
  PHARMACIST = 'PHARMACIST',
  ADMIN = 'ADMIN',
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
        pharmacyId: string | null;
        banned: boolean;
        image: string | null;
        emailVerified: boolean;
      };
    }
  }
}

const buildHeaders = (req: Request): Headers => {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value as string);
      }
    }
  });
  return headers;
};

const verifyAuth = (...roles: Role[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: buildHeaders(req),
      });

      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: 'You are unauthorized!',
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: 'Email verification required. Please verify your email!',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (user.banned) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended. Contact support.',
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        pharmacyId: user.pharmacyId,
        banned: user.banned,
        image: user.image,
        emailVerified: !!user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resources!",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default verifyAuth;
