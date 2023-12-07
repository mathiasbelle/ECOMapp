const mongoose = require("mongoose");

const dbConnect = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connection success!");
    } catch (error) {
        console.log("Database connection error.");
        console.log(error);
    }
}

module.exports = dbConnect;