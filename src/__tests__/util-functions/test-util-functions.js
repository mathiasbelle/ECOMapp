const { login } = require('../../services/auth-service');
const { createProduct } = require('../../services/product-service');
const { createUser } = require('../../services/user-service');


/**
 * Creates a user using the provided mockUser data and then logs in the user.
 *
 * @param {Object} mockUser - The mock user data to create the user with.
 * @return {Object} An object containing the created user and the access token.
 */
async function createAndLoginUserUtil(mockUser) {
    const user = await createUser({
        ...mockUser,
    });
    const { accessToken } = await login(
        user.email,
        mockUser.password
    );

    return {
        user,
        accessToken
    };
}


/**
 * Creates a product utility.
 *
 * @param {Object} mockProduct - The mock product object.
 * @param {string} userId - The user ID.
 * @return {Promise<Object>} The created product.
 */
async function createProductUtil(mockProduct, userId) {
    const product = await createProduct({...mockProduct}, userId);
    return product;
}


/**
 * Creates a user and a product, and returns the created user, access token, and product.
 *
 * @param {Object} mockUser - the mock user object
 * @param {Object} mockProduct - the mock product object
 * @return {Object} an object containing the created user, access token, and product
 */
async function createUserAndProduct(mockUser, mockProduct) {
    const user = await createUser({
        ...mockUser,
    });
    const { accessToken } = await login(
        user.email,
        mockUser.password
    )
    const product = await createProduct({...mockProduct}, user._id);
    return {
        user,
        accessToken,
        product
    };
}

module.exports = {
    createAndLoginUserUtil,
    createProductUtil,
    createUserAndProduct
}