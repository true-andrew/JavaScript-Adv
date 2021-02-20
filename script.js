const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

let makeGetRequest = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject('Error');
                } else {
                    resolve(xhr.responseText);
                }
            }
        }
        xhr.send();
    })
}

class GoodsItem {
    constructor(title, price, id_product) {
        this.product_name = title;
        this.price = price;
        this.id_product = id_product;
    }

    _render() {
        return `<div class="goods-item"><img src="https://via.placeholder.com/150C/O https://placeholder.com/" alt="placeholder"><h3>${this.product_name}</h3><p>${this.price}</p>
<button class="cart-button cart-button--add" name="addToCart" type="button" id="${this.id_product}">В корзину</button>
<button class="cart-button cart-button-options cart-button-options--increase" name="increaseGood" type="button" id="${this.id_product}">Добавить ещё</button>
<button class="cart-button cart-button-options cart-button-options--delete" name="deleteFromCart" type="button" id="${this.id_product}">Удалить</button></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
        this.total_price = 0;
        this._getProducts().then(data => {
            this.goods = [...data];
            this._render();
            this.countFinalPrice();
        });
    }

    /*_fetchGoods() {
        makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
            this.goods = JSON.parse(goods);
            this._render()
        })
    }*/

    _getProducts() {
        return makeGetRequest(`${API_URL}/catalogData.json`).then(response => JSON.parse(response.toString())).catch(error => console.log(error));
        //return fetch(`${API_URL}/catalogData.json`).then(response => response.json()).catch(error => console.log(error));
    }

    _render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price, good.id_product);
            listHtml += goodItem._render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }

    countFinalPrice() {
        for (let i = 0; i < this.goods.length; i++) {
            this.total_price += this.goods[i].price;
        }
    }
}

class CartItem {
    constructor(title, price, id_product, quantity) {
        this.product_name = title;
        this.price = price;
        this.id_product = id_product;
        this.quantity = quantity;
    }

    _render() {
        return `<div class="cart-item"><h3>${this.product_name}</h3><p>Кол-во: ${this.quantity}</p><p>Цена: ${this.price*this.quantity}</p></div>
                `;
    }
}

class CartList extends GoodsList {
    constructor() {
        super();
        this.cart_goods = [];
    }

    addToBucket(id) {
        this.goods.forEach((good) => {
            if (parseInt(id) === good.id_product && !this.cart_goods.includes(good)) {
                this.cart_goods.push(good);
                good.quantity = 1;
            }
        })
    }

    increaseBucket(id) {
        this.goods.forEach((good) => {
            if (parseInt(id) === good.id_product && this.cart_goods.includes(good)) {
                good.quantity += 1;
            }
        })
    }

    deleteFromBucket(id) {
        this.goods.forEach((good) => {
            if (parseInt(id) === good.id_product) {
                this.cart_goods.splice(this.cart_goods.indexOf(good), 1);
            }
        })
    }

    countQuantityAndPrice() {
        this.final_quantity = 0;
        this.final_cart_price = 0;
        this.cart_goods.forEach(good => {
            this.final_quantity += good.quantity;
            this.final_cart_price += (good.price * good.quantity);
        })
    }


    renderCart() {
        let listHtml = '';
        this.cart_goods.forEach(good => {
            const goodItem = new CartItem(good.product_name, good.price, good.id_product, good.quantity);
            listHtml += goodItem._render();
        });
        document.querySelector('.cart-list-goods').innerHTML = listHtml;
    }
}


const list = new GoodsList();
list._getProducts().then(() => console.log(list.total_price));
const bucket = new CartList();
document.addEventListener('click', (event) => {
    if (event.target.name === 'addToCart') {
        bucket.addToBucket(event.target.id);
        event.target.style = 'display:none';
        event.target.parentNode.querySelector('.cart-button-options--increase').style = 'display:block';
        event.target.parentNode.querySelector('.cart-button-options--delete').style = 'display:block';
    } else if (event.target.name === 'increaseGood') {
        bucket.increaseBucket(event.target.id);
    } else if (event.target.name === 'deleteFromCart') {
        bucket.deleteFromBucket(event.target.id);
        event.target.parentNode.querySelector('.cart-button-options--increase').style = 'display:none';
        event.target.parentNode.querySelector('.cart-button-options--delete').style = 'display:none';
        event.target.parentNode.querySelector('.cart-button--add').style = 'display:block';
    }
    if (event.target.className === 'cart-button') {
        if (!document.querySelector('#cart').checked) {
            document.getElementById('cart').checked = true;
            bucket.countQuantityAndPrice();
            document.querySelector('#number_of_goods').innerHTML = bucket.final_quantity;
            document.querySelector('#price_of_goods').innerHTML = bucket.final_cart_price;
            bucket.renderCart();
            document.querySelector('.cart-list').style = 'display:flex';
        } else {
            document.getElementById('cart').checked = false;
            document.querySelector('.cart-list').style = 'display:none';
        }
    }
})