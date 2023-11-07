import express, {Router} from "express";
import {auth} from "../Middleware/auth";
import {signIn, signUp} from "../Controllers/auth";
import {createMovie, deleteMovie, getMovieById, getMovies, updateMovie} from "../Controllers/Movie";
const router : Router = express.Router();

// Authentication Routes
router.post('/user/signin',  signIn);
router.post('/user/signup',   signUp);


// Movie Route
router.get('/movies', auth, getMovies);
router.get('/movies/:id', auth, getMovieById);
router.post('/movie', auth, createMovie);
router.put('/movies/:id', auth, updateMovie);
router.delete('/movies/:id', auth, deleteMovie)


export default router;