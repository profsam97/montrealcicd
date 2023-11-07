
import {Request, Response} from "express";
import {IUser, User} from "../Models/User";

export const signUp = async (req : Request, res: Response) => {
    try {
        const {password, email} = req.body;
        if (!password || !email) return res.status(400).send({message: 'You need to setup a password and email'});
        const userExist: IUser | null = await User.findOne({email});
        if (userExist) return res.status(400).send({message: 'User Already Exist'})
        const user = new User({password, email})
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({message: 'User successfully saved', token})
    }
    catch (e) {
        console.log(e)
        res.status(500).send({message: 'Internal server Error'})
    }
}

export const signIn = async (req : Request, res : Response) => {
    try {

    const {password, email} = req.body;
    const userExist : IUser | null = await User.findOne({email});
    if (!userExist) return res.status(401).send({message: "You don't have an account with us, pls register"});
    const authUser = await userExist.verifyPassword(userExist, password);
    const token = await authUser.generateAuthToken();
    res.status(200).send({token})

    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
