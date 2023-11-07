import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {User} from "../Models/User";

export const tokenId = new mongoose.Types.ObjectId();
export const userOne = {
    _id: tokenId,
    email: 'profs@jfg.com',
    password: '1233333',
    tokens: [{
        token: jwt.sign({_id: tokenId.toString()}, process.env.JWT_SECRET as string)
    }]

}

export const setUpDataBase   = async () => {
    const user = new User(userOne);
    await user.save()
}