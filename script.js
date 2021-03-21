const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        products: [],
        cart: [],
        imgCatalog: 'https://placehold.it/150x150',
        searchLine: '',
        amount: 0,
        final_price: 0,
        isVisibleCart: false,
        emptyList: false,
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(response => response.json())
                .catch(error => {
                    this.emptyList = true;
                    console.log(error);
                });
        },
        addProduct(product) {
            this.getJson(`${API_URL}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = product.id_product;
                        let find = this.cart.find(elem => elem.id_product === productId);
                        if (find) {
                            find.quantity++;
                            this.final_price += find.price;
                        } else {
                            let new_product = {
                                id_product: productId,
                                price: product.price,
                                product_name: product.product_name,
                                quantity: 1
                            };
                            this.cart.push(new_product);
                            this.final_price += new_product.price;
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        removeProduct(product) {
            this.getJson(`${API_URL}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = product.id_product;
                        let find = this.cart.find(elem => elem.id_product === productId);
                        this.final_price -= find.price;
                        if (find.quantity > 1) {
                            find.quantity--;
                        } else {
                            this.cart.splice(this.cart.indexOf(find), 1);
                        }
                    } else {
                        alert('Error');
                    }
                })
        }
    },
        filter(value) {
            const exp = new RegExp(value, 'i');
            this.filtered = this.products.filter(product => exp.test(product.product_name));
            this.products.forEach(elem => {
                const block = document.querySelector(`.good-item[data-id="${elem.id_product}"]`);
                if (!this.filtered.includes(elem)) {
                    block.classList.add('invisible');
                } else {
                    block.classList.remove('invisible');
                }
            })
        },

    mounted() {
        this.getJson(`${API_URL + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
});