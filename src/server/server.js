const express = require('express');
const fs = require('fs');
const cartRouter = require('./cartRouter');
const app = express();
const path = require('path');

const publicPath = path.resolve(__dirname, '../public');
const productsPath = path.resolve(__dirname, './db/products.json');

app.use(express.json());
app.use('/', express.static(publicPath));
app.use('/api/cart', cartRouter);

app.get('/api/products', (req, res) => {
    fs.readFile(productsPath, 'utf-8', (err, data) => {
        if (err) {
            res.send(JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});