import express, {NextFunction, Request, Response} from 'express'
import jwt from "jsonwebtoken";
import {User} from "../Models/User";
import {ObjectId} from "mongodb";
import {IUser} from "../../types/types";
export const auth : express.RequestHandler = async (req :Request  , res : Response, next : NextFunction) => {
    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const decoded : any  = await jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await User.findOne({_id: new ObjectId(decoded._id)});
        if(!user){
            throw new Error("Not found" + "" + decoded + "")
        }
        req.token = token;
        req.user = user;
        next();
    }

    catch (e) {
        console.log(e)
        res.status(403).send({error : 'Please Authenticate'})
    }
}
