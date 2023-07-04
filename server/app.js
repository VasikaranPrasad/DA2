const express = require('express');

const app = express();

const routes = require('./routers/OutputRouter')


app.use('/', routes)

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));