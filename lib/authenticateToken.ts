import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
// Middleware to check for a valid JWT on protected routes
const SECRET: string = process.env.TOKEN_SECRET || "SECRETITO"


const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    jwt.verify(token, SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
  
      // Set the user in the request object for further use
      req.user = user;
      next();
    });
};