import { Request, Response } from 'express';
import Movie, {IMovieType} from "../Models/Movie";
import movie from "../Models/Movie";
import exp from "constants";
type Tuser = {
    _id: string,
    email: string
}

interface IUser  extends Request{
    user: Tuser
}
export const createMovie = async (req: Request, res: Response) => {
    try {
        const { title, description, url, releaseDate } = req.body;

        if (!title) return  res.status(400).send({message: 'Bad request'})
        const user = req.user;
        const createdMovies : IMovieType[] = await Movie.find({createdBy: user._id})
        if (createdMovies.length >= 100) return res.status(400).send({message: 'You can not create more than 100 movies'});
        const movie = new Movie({
            title,
            description,
            url,
            releaseDate,
            createdBy : user._id,
        });
        await movie.save();
        res.status(201).json({ message: 'Movie created successfully', movie });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Something went wrong' });
    }
};

export const getMovies = async (req: Request, res: Response) => {
    try {
        const createdBy = req.user._id;
        const movies = await Movie.find({createdBy})
        res.status(200).send(movies)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getMovieById = async (req: Request, res: Response) => {
    try {
        const createdBy = req.user._id;
        const {id} = req.params;
        const movie = await Movie.findOne({_id: id, createdBy});
        if (!movie) {
            return res.status(404).json({message: 'Movie not found'});
        }
        res.status(200).send(movie)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}
export const updateMovie = async (req: Request, res: Response) => {
    try {
        const createdBy = req.user.id;
        const { id } = req.params;
        const movieData = Object.keys(req.body);
        const movie : IMovieType | null = await Movie.findOne({_id: id, createdBy})
        if (!movie) return  res.status(404).send({message: 'Movie does not exist'})
        const updates : string [] = ['url', 'releaseDate', 'title', 'description'];
        const isAllowedUpdates : boolean  = movieData.every(movie => updates.includes(movie))
        if (!isAllowedUpdates) return  res.status(400).send({message: 'Invalid updates'});
        movieData.forEach((data : string) => (movie as any)[data] = req.body[data]);
        await movie!.save()
        res.status(200).send({message: 'Movie Updated Successfully'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteMovie = async (req : Request, res: Response) => {
        try {
            const {id} = req.params;
            const getMovie : IMovieType | null  = await Movie.findOne({_id: id, createdBy: req.user._id});
            if (!getMovie) return res.status(404).send({message: "Movie not found"});
            await Movie.findByIdAndDelete(id)
            res.status(200).send({message: 'Deleted Successfully'});
        }
        catch (e) {
            console.log(e)
            res.status(500).send('Internal Server Error')
        }
}