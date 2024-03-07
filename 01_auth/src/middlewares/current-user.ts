import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

interface UserPayload {
    id: string;
    email: string;
}

// 重新定义已存在的接口！
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(!req.session?.jwt) {
        return next()
    }
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
        // 需要把 current user 的数据，添加给 req, 需要先改定义
        req.currentUser = payload;
    } catch (err) {}

    next() 
}