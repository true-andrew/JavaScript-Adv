const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List {
    constructor(url, container, list = listContext) {
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this.filtered = [];
        this._init();
    }

    getJson(url) {
        return fetch(url ? url : `${API_URL + this.url}`).then(response => response.json()).catch(error => {
            console.log(error)
        });
    }

    handleData(data) {
        this.goods = [...data];
        this.render();
    }

    countFinalPrice() {
        return this.allProducts.reduce((it, good) => it += good.price, 0);
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new this.list[this.constructor.name](product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('afterbegin', productObj.render());
        }
    }

    filter() {
    }

    _init() {
        return false;
    }
}

class Item {
    constructor(elem, img = 'https://via.placeholder.com/150C/O https://placeholder.com/') {
        this.product_name = elem.product_name;
        this.price = elem.price;
        this.id_product = elem.id_product;
        this.img = img;
    }

    render() {
        return `<div class="goods-item">
                    <img src=${this.img} alt="placeholder">
                    <h3>${this.product_name}</h3>
                    <p>${this.price}</p>
<button class="cart-button cart-button--add" name="addToCart" type="button" data-id="${this.id_product}" data-name="${this.product_name}" data-price="${this.price}">В корзину</button>
    `;
    }
}

class GoodsItem extends Item {
}

class GoodsList extends List {
    constructor(cart, container = '.goods-list', url = "/catalogData.json") {
        super(url, container);
        this.cart = cart;
        this.getJson().then(data => {
            this.handleData(data);
            console.log(this.countFinalPrice());
        });
    }

    _init() {
        document.querySelector(this.container).addEventListener('click', event => {
            if (event.target.classList.contains('cart-button--add')) {
                this.cart.addProduct(event.target);
            }
        });
        // document.querySelector('.search-form').addEventListener('submit', event => {
        //     event.preventDefault();
        //     this.filter(document.querySelector('.search-field').value)
        // })
    }
}

class CartItem extends Item {
    constructor(el, img = 'https://via.placeholder.com/150C/O https://placeholder.com/') {
        super(el, img);
        this.quantity = el.quantity;
    }

    render() {
        return `<div class="cart-item" data-id=${this.id_product}>
                    <div class="product-bio">
                        <figure><img src="${this.img}" alt="product"></figure>
                        <figcaption>
                            <h3>${this.product_name}</h3>
                            <p class="product-quantity">Кол-во: ${this.quantity}</p>
                            <p>Цена: ${this.price} за ед.</p>
                        </figcaption>                       
                    </div>
                    <div class="right-block">
                        <p class="product-price">${this.quantity * this.price}</p>
                        <button class="del-btn" data-id="${this.id_product}">&#10006;</button>
                    </div>
                </div>`;
    }
}

class CartList extends List {
    constructor(container = '.cart-list', url = "/getBasket.json") {
        super(url, container);
        this.getJson().then(data => {
            this.amount = data.amount;
            this.countGoods = data.countGoods;
            this._renderSummary();
            this.handleData(data.contents);
        });
    }

    addProduct(element) {
        this.getJson(`${API_URL}/addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    this.countGoods++;
                    if (find) {
                        find.quantity++;
                        this.amount += find.price;
                        this._renderSummary();
                        this._updateCart(find);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.amount += product.price;
                        this._renderSummary();
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    removeProduct(element) {
        this.getJson(`${API_URL}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    this.countGoods--;
                    this.amount -= find.price;
                    this._renderSummary();
                    if (find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    _renderSummary() {
        document.getElementById('price_of_goods').innerHTML = this.amount;
        document.getElementById('number_of_goods').innerHTML = this.countGoods;
    }

    _updateCart(product) {
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Кол-во: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price}`;

    }

    _init() {
        document.querySelector('.cart-button').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener(('click'), e => {
            if (e.target.classList.contains('del-btn')) {
                this.removeProduct(e.target);
            }
        });
    }
}

const listContext = {
    GoodsList: GoodsItem,
    CartList: CartItem
};

let cart = new CartList();
let products = new GoodsList(cart);