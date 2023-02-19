import jwt, {Secret, JwtPayload} from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const SECRET_KEY: Secret = 'jwtSecretToken';

export type CustomRequest = {
    token: string ; 
}

export const cauth = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const custToken = req.header('auth-token');
        if(!custToken){
            throw new Error();
        }
        const decoded = jwt.verify(custToken, SECRET_KEY);
        const cusid = decoded;
        const userId = cusid;
        
        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
}