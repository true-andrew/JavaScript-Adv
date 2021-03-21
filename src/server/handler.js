const fs = require('fs');
const cart = require('./cart');
const path = require('path');

const actions = {
    add: cart.add,
    change: cart.change,
    delete: cart.remove,
};

const statsPath = path.resolve(__dirname, './db/stats.json');

const handler = (req, res, action, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            const newCart = actions[action](JSON.parse(data), req);
            fs.writeFile(file, newCart, (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            })
        }
    });
    fs.readFile(statsPath, 'utf-8', (err, data) => {
        if (err) {
            console.log(`Ошибка при чтении файла статистики: ${err}`);
        } else {
            const stat = JSON.parse(data);
            const time = new Date();
            const newStat = {
                product: `${req.body.product_name}`,
                action: `${action}`,
                time: `${time}`,
            }
            stat.push(newStat);
            fs.writeFile(statsPath, JSON.stringify(stat, null, 4), (err) => {
                if (err) {
                    console.log(`Ошибка при записи файла статистики: ${err}`);
                }
            })
        }
    })
};


module.exports = handler;