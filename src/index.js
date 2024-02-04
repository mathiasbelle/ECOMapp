require('dotenv').config()
const morgan = require("morgan");
const express = require("express");
const dbConnect = require("./../config/db");
const userRoutes = require("./user/user-routes");
const authRoutes = require('./auth/auth-routes');
const productRoutes = require('./product/product-routes');
const cartRoutes = require('./cart/cart-routes');
const errorHandler = require('./middleware/error-middleware').errorHandler;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))


dbConnect();

app.use(morgan("dev"));


app.use(userRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);

app.use(errorHandler);


app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!')
  })

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!')
  })

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})