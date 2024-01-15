require('dotenv').config()
const morgan = require("morgan");
const express = require("express");
const dbConnect = require("./../config/db");
const userRoutes = require("./routes/user-routes");
const authRoutes = require('./routes/auth-routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))


dbConnect();

app.use(morgan("dev"));


app.use(userRoutes);
app.use(authRoutes);


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