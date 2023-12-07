require('dotenv').config()
const morgan = require("morgan");
const express = require("express");
const dbConnect = require("./../config/db");
const userRoutes = require("./routes/user-routes");


const app = express();



dbConnect();

app.use(morgan("dev"));
app.use(express.json());

app.use(userRoutes)


app.get('/', (req, res) => {
    res.send('Hello World!')
  })

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})