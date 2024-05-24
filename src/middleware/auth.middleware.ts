import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

// Middleware to authenticate requests
export const auth = (req: Request, res: Response, next: NextFunction) => {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token) ;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) ;
        console.log(decoded) ;
        // Attach the decoded token to the request object
        (req as CustomRequest).token = decoded ;
        next() ;
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token', err: error });
    }
}