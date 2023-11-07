import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
type  Itoken = {
    token : string,
}
export interface IUser extends mongoose.Document {
    email: number,
    password: string,
    tokens: Itoken[],
    verifyPassword:  (user : IUser, password: string)   => Promise<IUser>,
    generateAuthToken: () => Promise<String>
}

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value: string) {
            if (value.toLowerCase().includes('password')){
                throw new Error('Password should not contain password')
            }
        }
    },
    email : {
        type: String,
        unique: true,
        required: true,
        validate(value : string){
            if(!validator.isEmail(value)){
            throw  new Error('Email is not Valid')
            }
        },

        tokens : [{
            token: {
                type: String,
                required: true
            }
        }],
    }
})

userSchema.methods.generateAuthToken = async function ()  {
    const user = this;
    try {
        const token =  jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET as string)
        user.tokens = user.tokens  ?   user.tokens.concat({token}) : [{token}]
        await user.save()
        return token
    }
    catch (e) {
        console.log(e)
    }
}

userSchema.methods.toJSON = function (){
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
}
userSchema.methods.verifyPassword =  async(user : IUser, password : string) => {
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user;
}
userSchema.pre('save', async function (next, opts){
    const user = this;
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

export const User = mongoose.model<IUser>('Users', userSchema)