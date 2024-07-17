const {faker} = require('@faker-js/faker');
const mongoose = require('mongoose');
const User = require('../models/user-model');
const ROLES = require('../enums/role-enum');
const { createUser } = require('../services/user-service');
const { createProduct } = require('../services/product-service');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
const dbConnect = require('../config/db');

function createRandomSeller() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({firstName, lastName});
    const username = faker.internet.userName({firstName, lastName});
    const password = faker.internet.password({length: 10});
    const role = ROLES.SELLER;
    return {name, email, username, password, role}
}

function createRandomProduct() {
    const name = faker.commerce.productName();
    const price = faker.commerce.price();
    const quantity = faker.number.int({ min: 0, max: 100 });
    const category = faker.commerce.department();
    const description = faker.commerce.productDescription();
    //const images = [`storage/testimages/image-${faker.number.int({ min: 1, max: 3 })}.jpg`];
    return {name, description, price, category, quantity}
}

const seedDB = async () => {
    try {
        dbConnect();

        const users = await User.find({});

        if (users.length < 100) {

            for (let i = 0; i < Math.abs(100 - users.length); i++) {
                try {
                    const user = await createUser(createRandomSeller());
                    const product = await createProduct({
                        ...createRandomProduct(),
                        owner: user.id});
                    product.images = [`storage/testimages/image-${Math.floor(Math.random() * 3) + 1}.jpg`];
                    await product.save();
                } catch (error) {
                    console.log(error);
                    if (error.message === 'Email is already in use.' || error.message === 'Username is already in use.') {
                        i--;
                    }                
                }
            }
        }
        await mongoose.disconnect();

        console.log('Database seeded successfully!');
    } catch (error) {
        console.log(error);
        console.log('Error when seeding database');
    }
}

seedDB();