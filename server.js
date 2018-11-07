const express = require('express');
const morgan = require('morgan');

const app = express();

const contentRouter = require('./contentRouter');

app.use(morgan('common'));

// app.use(express.static('public'));

app.get('/', (req, res) => {
    res.status(204).end;
});

app.use('/blog-posts', contentRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
})