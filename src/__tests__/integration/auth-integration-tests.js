const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app.js');
const {createUser} = require('../../services/user-service.js');
const jwt = require('jsonwebtoken');
const {describe, expect, it} = require('@jest/globals');
const mockUser = require('../mocks/mockUser.js');


describe('Auth integration tests', () => {
    beforeEach(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });
    
    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        describe('Posting with valid data', () => {
            it('Should create a new user and the JWT token', async () => {
               const res = await request(app).post('/api/auth/register').send(mockUser);
               expect(res.status).toBe(200);
               const result = jwt.verify(res.body.accessToken, process.env.JWT_SECRET, {
                audience: 'users',
                issuer: 'login'
                });
                //console.log(result);
                expect(result.name).toEqual(mockUser.name);
                expect(result.email).toEqual(mockUser.email);
            });
        });

        describe('Posting with invalid data', () => {
            it('Should return an error', async () => {
                const res = await request(app).post('/api/auth/register').send({name: 'John Doe'});
                expect(res.status).toBe(400);
            });
        });
    });

    describe('POST /api/auth/login', () => {
       describe('Logging in with valid data', () => {
           it('Should return the JWT token', async () => {  
            await createUser({...mockUser, password: mockUser.password});
                const res = await request(app).post('/api/auth/login').send({
                    email: mockUser.email,
                    password: mockUser.password
                });
                expect(res.status).toBe(200);
                const result = jwt.verify(res.body.accessToken, process.env.JWT_SECRET, {
                    audience: 'users',
                    issuer: 'login'
                    });
                    expect(result.name).toEqual(mockUser.name);
                    expect(result.email).toEqual(mockUser.email);
                });
        });

        describe('Loggin in with invalid data', () => {
            it('Should return a 401 and an error message', async () => {
                await createUser(mockUser);
                const res = await request(app).post('/api/auth/login').send({
                    email: 'wrongjohndoe@example.com',
                    password: mockUser.password
                });
                expect(res.status).toBe(401);
                expect(res.body.error).toEqual('Email or password incorrect.');
            });
        });
    });
});