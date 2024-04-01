const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app.js');
const { describe, expect, it } = require('@jest/globals');
const { createProductUtil, createUserAndProduct } = require('../util-functions/test-util-functions.js');
const mockUser = require('../mocks/mockUser.js');
const {mockProduct, mockProduct2} = require('../mocks/mockProduct.js');


describe('Cart Integration Tests', () => {
    beforeEach(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    const quantity = 1;

    describe('POST /api/cart', () => {
        describe('Putting a product in a empty cart with valid data', () => {
            it('Should put a product in a empty cart and return it', async () => {
                const {user, accessToken, product} = await createUserAndProduct(mockUser, mockProduct);
                const res = await request(app)
                    .post('/api/cart')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        productId: product.id,
                        quantity: quantity
                    });
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    bill: product.price * quantity,
                    owner: user._id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    products: [
                        {
                            productId: product.id,
                            quantity: quantity,
                            price: product.price,
                            _id: expect.any(String),
                        }
                    ]
                });
            });
        });

        describe('Putting a product with insufficient quantity in a cart with valid data', () => {
            it('Should send a 400 and an error message', async () => {
                const { accessToken, product} = await createUserAndProduct(mockUser, mockProduct);
                const res = await request(app)
                    .post('/api/cart')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        productId: product.id,
                        quantity: product.quantity + 1
                    });
                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: 'Stock is not enough.'
                });
            });
        });

        describe('Putting a product that does not exists in a cart)', () => {
            it('Should send a 400 and an error message', async () => {
                const { accessToken } = await createUserAndProduct(mockUser, mockProduct);
                const res = await request(app)
                    .post('/api/cart')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        productId: new mongoose.Types.ObjectId(),
                        quantity: quantity
                    });
                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: 'Product does not exist.'
                });
            });
        });

        describe('Putting a product in a cart that already exists', () => {
            it('Should send the updated cart', async () => {
                const { accessToken, product } = await createUserAndProduct(mockUser, mockProduct);
                const res = await request(app)
                    .post('/api/cart')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        productId: product.id,
                        quantity: quantity
                    });
                const res2 = await request(app)
                    .post('/api/cart')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        productId: product.id,
                        quantity: quantity
                    });
                expect(res.status).toBe(200);
                expect(res2.status).toBe(200);
                expect(res2.body.products[0]).toEqual({
                    ...res.body.products[0],
                    quantity: res.body.products[0].quantity + quantity
                });
            });
        });
    });

    describe('PATCH /api/cart', () => {
        describe('Updating a cart with valid data', () => {
            it('Should send the updated cart', async () => {
                const { accessToken, product } = await createUserAndProduct(mockUser, mockProduct);
                const res = await request(app)
                    .post('/api/cart')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        productId: product.id,
                        quantity: quantity
                    });
                const product2 = await createProductUtil(mockProduct2, mockUser._id);
                const res2 = await request(app)
                    .patch('/api/cart')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        productId: product2.id,
                        quantity: product2.quantity
                    });
                expect(res.status).toBe(200);
                expect(res2.status).toBe(200);
                expect(res2.body.products.length).toEqual(2);
                expect(res2.body.products[0]).toEqual(res.body.products[0]);
                expect(res2.body.products[1]).toEqual({
                    productId: product2.id,
                    quantity: product2.quantity,
                    price: product2.price,
                    _id: expect.any(String),
                });
                expect(res2.body.bill).toEqual(product.price * quantity + product2.price * product2.quantity);

            });
        });
        
    });
});