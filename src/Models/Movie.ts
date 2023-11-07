import mongoose from "mongoose";
import {User} from "./User";

export interface IMovieType extends mongoose.Document {
    title: string,
    description: string,
    url: string,
    createdBy : string,
    createdAt: Date,
    updatedAt: Date
}

const movieSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true
    },
    url : {
        type: String,
        default: 'www.idmb.com',
        required: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref : User
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true
})

const Movie =  mongoose.model<IMovieType>('Movies', movieSchema);

export default Movie;