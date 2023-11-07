import mongoose from 'mongoose';
import request from 'supertest';
import Movie from "../Models/Movie";
import app from "../app";
import {setUpDataBase, userOne} from "./user";
import {describe, expect, it,  beforeEach, beforeAll, afterAll} from '@jest/globals';
import {User} from "../Models/User";
describe('Montech API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.Mongo_URL as string);
    }, 10000);
    afterAll(  (done) => {
         mongoose.connection.close();
    });
    beforeEach(async () => {
        await User.deleteMany({});
        await  setUpDataBase();
        await Movie.deleteMany({});
    }, 20000);

    describe('POST /user', () => {
        it('Should save a user successfully', async () => {
            await request(app)
                .post('/user/signup')
                .send({
                    email: 'helloThere@sdff.com',
                    password: "1222222"
                }).expect(201);
        })
        it('Should not save an existing user successfully', async () => {
            const user = new User({
                email: 'helloThere@sdff.com',
                password: "1222222"
            })
            await user.save()
            await request(app)
                .post('/user/signup')
                .send({
                    email: 'helloThere@sdff.com',
                    password: "1222222"
                }).expect(400);
        })
        it('Should Sign In an existing user successfully', async () => {
            const user = new User({
                email: 'helloThere@sdff.com',
                password: "1222222"
            })
            await user.save()
            await request(app)
                .post('/user/signin')
                .send({
                    email: 'helloThere@sdff.com',
                    password: "1222222"
                }).expect(200);
        })
        it('Should not sign in a user that does not exist', async () => {
            await request(app)
                .post('/user/signin')
                .send({
                    email: "hithere@gmail.com",
                    password: "sd23232"
                }).expect(401)
        })
    })
    describe('GET /movies', () => {
        it('should return an empty array when there are no movies', async () => {
            const response = await request(app).get('/movies')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200)
                expect(response.body).toEqual([]);
        });

        it('should return an array of movies when there are movies', async () => {
            const movie1 = new Movie({
                title: 'The Godfather',
                url: 'www.hello.com',
                description: 'Francis Ford Coppola',
                createdBy: userOne._id
            });
            await movie1.save();

            const movie2 = new Movie({
                title: 'The Godfather',
                url: 'www.hello.com',
                description: 'Francis Ford Coppola',
                createdBy: userOne._id
            });
            await movie2.save();

            const response = await request(app).get('/movies')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200)
            expect(response.body).toHaveLength(2);
        });
    });

    describe('POST /movies', () => {
        it('should create a new movie', async () => {
            const response = await request(app)
                .post('/movie')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    title: 'The Godfather',
                    url: 'www.goat.com',
                    description: 'Francis Ford Coppola',
                    createdBy: userOne._id
                }).expect(201);

            const movie = await Movie.findById(response.body.movie._id);
            expect(movie).toBeDefined();
            expect(movie!.title).toBe('The Godfather');
            expect(movie!.url).toBe('www.goat.com');
            expect(movie!.description).toBe('Francis Ford Coppola');
            expect(movie!.createdAt).toEqual(expect.any(Date));
            expect(movie!.updatedAt).toEqual(expect.any(Date));
        });

        it('should return a 400 error if the movie data is invalid', async () => {
             await request(app)
                .post('/movie')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    age: 44,
                })
                .expect(400)
        });
    });

    describe('PUT /movies/:id', () => {
        it('should update an existing movie', async () => {
            const movie = new Movie({
                title: 'The Godfather',
                url: 'somerandomurl.com',
                description: 'Francis Ford Coppola',
                createdBy: userOne._id
            });
            await movie.save();
            const response = await request(app)
                .put(`/movies/${movie._id}`)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    title: 'The Godfather: Part II',
                    url: 'www.url.com',
                    description: 'Francis Ford Coppola',
                })
                .expect(200)
            expect(response.body).toEqual({
                message: 'Movie Updated Successfully',
            });

            const updatedMovie = await Movie.findById(movie._id);
            expect(updatedMovie).toBeDefined();
            expect(updatedMovie!.title).toBe('The Godfather: Part II');
            expect(updatedMovie!.url).toBe('www.url.com');
            expect(updatedMovie!.description).toBe('Francis Ford Coppola');
            expect(updatedMovie!.createdAt).toEqual(expect.any(Date))
            expect(updatedMovie!.updatedAt).toEqual(expect.any(Date))
        });

        it('should return a 400 error if the movie data is invalid', async () => {
            const movie = new Movie({
                title: 'The Godfather',
                url: 'www.hello.com',
                description: 'Francis Ford Coppola',
                createdBy: userOne._id
            });
            await movie.save();

            const response = await request(app)
                .put(`/movies/${movie._id}`)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    year: 1972,
                });
            expect(response.status).toBe(400);
        });
    });
    describe('DELETE /movies:id', () => {
        it('Should delete an existing movie', async () => {
            const movie = new Movie ({
                title: 'The Originals',
                url: 'www.url.com',
                description: 'A very good movie',
                createdBy: userOne._id
            })
            await movie.save();
           await request(app)
                .delete(`/movies/${movie._id}`)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200)
        })
        it('should not delete a movie that does not exist ', async () => {
            await request(app)
                .delete(`/movies/2121212121212ads21212`)
                .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
                .expect(500)
        });
    })
});

