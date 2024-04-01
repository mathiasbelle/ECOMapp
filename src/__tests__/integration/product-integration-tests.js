const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app.js');
//const { createUser } = require('../../services/user-service.js');
const { describe, expect, it } = require('@jest/globals');
//const { login } = require('../../services/auth-service.js');
const mockUser = require('../mocks/mockUser.js');
const {mockProduct} = require('../mocks/mockProduct.js');
const { createAndLoginUserUtil } = require('../util-functions/test-util-functions.js');

describe('Product Integration Tests', () => {
    beforeEach(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/products', () => {
        describe('Creating a new product with valid data', () => {
            it('Should create a new product and return it', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                // //console.log(accessToken);
                const { user, accessToken } = await createAndLoginUserUtil(mockUser);
                const res = await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ ...mockProduct, owner: user._id });
                //console.log(res.body);
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    __v: expect.any(Number),
                    _id: expect.any(String),
                    name: mockProduct.name,
                    price: mockProduct.price,
                    quantity: mockProduct.quantity,
                    category: mockProduct.category,
                    description: mockProduct.description,
                    owner: user._id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            });
        });

        describe('Creating a new product with invalid data', () => {
            it('Should send a 400 and an error message if name is missing', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                const { user, accessToken } = await createAndLoginUserUtil(mockUser);
                const res = await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        price: mockProduct.price,
                        quantity: mockProduct.quantity,
                        category: mockProduct.category,
                        description: mockProduct.description,
                        owner: user._id,
                    });
                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: expect.any(Array),
                });
            });
        });

        describe('Creating a new product without loggin in', () => {
            it('Should send a 401 and an error message', async () => {
                const res = await request(app)
                    .post('/api/products')
                    .send({ ...mockProduct });
                expect(res.status).toBe(403);
                expect(res.body).toEqual({
                    error: expect.any(String),
                });
            });
        });
    });

    describe('GET /api/products', () => {
        describe('Getting one product with a valid id', () => {
            it('Should return the one product', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                const { user, accessToken } = await createAndLoginUserUtil(mockUser);
                const product = await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ ...mockProduct, owner: user._id });
                const res = await request(app)
                    .get(`/api/products/${product.body._id}`)
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    __v: expect.any(Number),
                    _id: expect.any(String),
                    name: mockProduct.name,
                    price: mockProduct.price,
                    quantity: mockProduct.quantity,
                    category: mockProduct.category,
                    description: mockProduct.description,
                    owner: user._id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            });
        });

        describe('Getting one product with a valid id that does not exist', () => {
            it('Should send a 404 and an error message', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                const { user, accessToken } = await createAndLoginUserUtil(mockUser);
                await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ ...mockProduct, owner: user._id });
                const mockId = new mongoose.Types.ObjectId();
                const res = await request(app)
                    .get(`/api/products/${mockId}`)
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(res.status).toBe(404);
                expect(res.body).toEqual({
                    error: 'Could not find product.',
                });
            });
        });

        describe('Getting one product without loggin in', () => {
            it('Should send a 401 and an error message', async () => {
                const res = await request(app).get(
                    `/api/products/${mockProduct._id}`
                );
                expect(res.status).toBe(403);
                expect(res.body).toEqual({
                    error: expect.any(String),
                });
            });
        });

        describe('Getting all products', () => {
            it('Should send a 200 and an array of products', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                const { user, accessToken } = await createAndLoginUserUtil(mockUser);
                await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ ...mockProduct, owner: user._id });
                const res = await request(app)
                    .get('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
            });
        });
    });

    describe('PATCH /api/products/:id', () => {
        describe('Updating a product with a valid id', () => {
            it('Should send a 200 and the updated product', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                const { user, accessToken } = await createAndLoginUserUtil(mockUser);
                const product = await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ ...mockProduct, owner: user._id });
                const res = await request(app)
                    .patch(`/api/products/${product.body._id}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ price: 1000 });
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    __v: expect.any(Number),
                    _id: expect.any(String),
                    name: mockProduct.name,
                    price: 1000,
                    quantity: mockProduct.quantity,
                    category: mockProduct.category,
                    description: mockProduct.description,
                    owner: user._id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            });
        });
    });

    describe('DELETE /api/products/:id', () => {
        describe('Deleting a product with a valid id', () => {
            it('Should send a 204', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                const { user, accessToken } = await createAndLoginUserUtil(mockUser);
                const product = await request(app)
                    .post('/api/products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ ...mockProduct, owner: user._id });
                const res = await request(app)
                    .delete(`/api/products/${product.body._id}`)
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(res.status).toBe(204);
            });
        });

        describe('Deleting a product with an invalid id', () => {
            it('Should send a 403', async () => {
                // const user = await createUser({
                //     ...mockUser,
                // });
                // const { accessToken } = await login(
                //     user.email,
                //     mockUser.password
                // );
                const { accessToken } = await createAndLoginUserUtil(mockUser);
                const mockId = new mongoose.Types.ObjectId();
                const res = await request(app)
                    .delete(`/api/products/${mockId}`)
                    .set('Authorization', `Bearer ${accessToken}`);
                expect(res.status).toBe(403);
            });
        });
    });
});
