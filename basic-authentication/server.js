const express = require('express');
const mongoose = require('mongoose')
const app = express()
const dotenv = require('dotenv')
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
dotenv.config();

// Database connection

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('connected to database')
    })

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + 'view/check.html');
});

app.use(express.json())

app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

app.listen(4000, (req, res) => {
    console.log('Server listening at 4000')
})