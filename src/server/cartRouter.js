const express = require('express');
const fs = require('fs');
const handler = require('./handler');
const router = express.Router();
const path = require('path');

const cartPath = path.resolve(__dirname, './db/cart.json');

router.get('/', (req, res) => {
    fs.readFile(cartPath, 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    });
});

router.post('/', (req, res) => {
    handler(req, res, 'add', cartPath);
});

router.put('/:id', (req, res) => {
    handler(req, res, 'change', cartPath);
});

router.delete('/:id', ((req, res) => {
    handler(req, res, 'delete', cartPath);
}));

module.exports = router;