class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    _render() {
        return `<div class="goods-item"><img src="https://via.placeholder.com/150C/O https://placeholder.com/" alt="placeholder"><h3>${this.title}</h3><p>${this.price}</p><button class="cart-button" type="button">В корзину</button></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
        this.final_price = 0;
    }

    _fetchGoods() {
        this.goods = [
            {title: 'Shirt', price: 150},
            {title: 'Socks', price: 50},
            {title: 'Jacket', price: 350},
            {title: 'Shoes', price: 250},
        ];
    }

    _render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem._render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }

    countFinalPrice() {
        for (let i = 0; i < this.goods.length; i++) {
            this.final_price += this.goods[i].price;
        }
    }
}

class CartItem extends GoodsItem {
    constructor(title, price, quantity) {
        super(title);
        super(price);
        this.quantity = quantity;
    }

    _render() {
        return `<div class="goods-item"><img src="https://via.placeholder.com/150C/O https://placeholder.com/" alt="placeholder"><h3>${this.title}</h3><p>${this.price}</p><p>В корзине</p></div>`;
    }
}

class CartList extends GoodsList {
    countQuantity() {
    }

    countFinalPrice() {
        super.countFinalPrice();
    }
}

const list = new GoodsList();
list._fetchGoods();
list._render();
list.countFinalPrice();
console.log(list.final_price);

/*const goods = [
    {title: 'Shirt', price: 150},
    {title: 'Socks', price: 50},
    {title: 'Jacket', price: 350},
    {title: 'Shoes', price: 250},
    {price: 1000}
];

//можно избавиться от return, так как в функции кроме возвращения строки ничего не происходит

const renderGoodsItem = (title = 'Без названия', price = 'Неизвестно') =>
    `<div class="goods-item">
                <img src="https://via.placeholder.com/150C/O https://placeholder.com/" alt="placeholder">
                <h3>${title}</h3>
                <p>Цена: ${price}</p>
                <button class="goods-btn">Добавить в корзину</button>
     </div>`;

const renderGoodsList = (list = goods) => {
    let goodsList = list.map(item => renderGoodsItem(item.title, item.price));
    //для избавления от запятых можно реализовать вывод товаров через цикл или использовать метод join.
    /*for (let i = 0; i < goodsList.length; i++) {
        document.querySelector('.goods-list').innerHTML += goodsList[i];
    }
    document.querySelector('.goods-list').innerHTML = goodsList.join(" ");
}
//Сокращение функции: можно не инициализировать переменную и записать все в одну строку.
/*const renderGoodsList = (list = goods) => document.querySelector('.goods-list').innerHTML = list.map(item => renderGoodsItem(item.title, item.price)).join(" ");


renderGoodsList(goods);*/
