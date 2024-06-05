const dbConnect = require('./config/db');

const app = require('./app');

dbConnect();

app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!')
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});