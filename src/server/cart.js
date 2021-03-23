const add = (cart, req) => {
    cart.contents.push(req.body);
    cart.amount++;
    cart.final_price += req.body.price;
    return JSON.stringify(cart, null, 4);
};

const change = (cart, req) => {
    const find = cart.contents.find(el => el.id_product === +req.params.id);
    find.quantity += req.body.quantity;
    cart.amount++;
    cart.final_price += +req.body.price;
    return JSON.stringify(cart, null, 4);
};

const remove = (cart, req) => {
    const find = cart.contents.find(el => el.id_product === +req.params.id);
    if (find.quantity > 1) {
        find.quantity--;
        cart.amount--;
        cart.final_price -= req.body.price;
    }
    else {
        cart.amount--;
        cart.final_price -= req.body.price;
        cart.contents.splice(cart.contents.indexOf(find), 1);
    }
    return JSON.stringify(cart, null, 4);
};

module.exports = {
    add,
    change,
    remove,
};
