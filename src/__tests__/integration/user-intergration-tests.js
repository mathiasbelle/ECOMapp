/* eslint-env node, jest */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app.js');
const {createUser} = require('../../services/user-service.js');
const mockUser = require('../mocks/mockUser.js');


describe('User Integration Tests', () => {
    beforeEach(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });
    
    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });
    
    
    
    describe('POST /api/users', () => {
        describe('Posting with valid data', () => {
            it('Should create a new user and return it', async () => {
                const res = await request(app).post('/api/users').send(mockUser);
        
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: mockUser.name,
                    email: mockUser.email,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
                expect(res.body.password).toBeUndefined();
            });
        });
        
    });
    
    describe('GET /api/users', () => {
        it('Should return all users', async () => {
            const user = await createUser(mockUser);
            const res = await request(app).get('/api/users');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }]);
        });
    });
    
    describe('GET /api/users/:id', () => {
        describe('Getting a user with valid user id', () => {
            it('Should return the correct user', async () => {
                const user = await createUser(mockUser);
                const res = await request(app).get(`/api/users/${user._id}`);
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            });
        });
    
        describe('Getting a user with invalid user id', () => {
           it('Should return 404', async () => {
               const res = await request(app).get('/api/users/123');
               expect(res.status).toBe(400);
               expect(res.body.error[0].msg).toEqual('Invalid user id.');
           });
        });
    });
    
    describe('PUT /api/users/:id', () => {
        describe('Updating a user with valid user id and valid data', () => {
            it('Should return the updated user', async () => {
                const user = await createUser(mockUser);
                const res = await request(app)
                    .put(`/api/users/${user._id}`)
                    .send({
                        name: 'Jane Doe',
                        email: 'janedoe@example.com',
                        password: 'password1234',
                    });
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    _id: user._id,
                    name: 'Jane Doe',
                    email: 'janedoe@example.com',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            });
        });
    
        describe('Updating a user with missing data', () => {
            it('Should return the updated user', async () => {
                const user = await createUser(mockUser);
                const res = await request(app).put(`/api/users/${user._id}`).send({name: 'Jane Doe'});
                //console.log(res.body);
                expect(res.status).toBe(400);
            });
        });
    });
    
    describe('PATCH /api/users/:id', () => {
        describe('Updating a user with valid user id and valid data', () => {
            it('Should return the updated user', async () => {
                const user = await createUser(mockUser);
                const res = await request(app)
                    .patch(`/api/users/${user._id}`)
                    .send({
                        name: 'Jane Doe'
                    });
                //console.log(res.body);
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    _id: user._id,
                    name: 'Jane Doe',
                    email: user.email,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            });
        });
    });
    
    
    describe('DELETE /api/users/:id', () => {
        describe('Deleting a user with valid user id', () => {
            it('Should return 204 as the status and no body', async () => {
                const user = await createUser(mockUser);
                const res = await request(app).delete(`/api/users/${user._id}`);
                //console.log(res.body);
                expect(res.status).toBe(204);
                expect(JSON.stringify(res.body)).toBe('{}');
            });
        });
        
        describe('Deleting a user with invalid user id', () => {
            it('Should return 404', async () => {
                const res = await request(app).delete('/api/users/123');
                expect(res.status).toBe(400);
                expect(res.body.error[0].msg).toEqual('Invalid user id.');
            });
        });
    });
});

