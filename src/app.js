require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
const morgan = require('morgan');
const express = require('express');
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');
const errorHandler = require('./middleware/error-middleware').errorHandler;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}


app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.use(errorHandler);

module.exports = app;