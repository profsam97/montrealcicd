import {Request} from "express";

type Tuser = {
    _id: string,
    email: string
}

export interface IUser  extends Request{
    user: Tuser
}