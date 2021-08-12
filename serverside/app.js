/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
"use strict";


const express = require('express');
const cors = require('cors');

const bookRouter = require('./routes/book');
const userRoutes = require('./routes/users');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/books', bookRouter);

app.use((req, res, next) => {
    res.status(404).send("Not found, please try again later!");
});


app.use((error, req, res, next) => {
    res.status(500).send("Something went wrong, please login later!");
});

mongoConnect(() => {
    app.listen(3000, () => console.log('listening to 3000...'));
});