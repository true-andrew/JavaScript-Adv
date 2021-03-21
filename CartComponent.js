Vue.component('cart', {
    data() {
        return {
            imgCart: 'https://placehold.it/150x150',
            cartUrl: '/getBasket.json',
            cartItems: [],
            isVisibleCart: false,
            final_price: 0,
            amount: 0,
        }
    },
    methods: {
        addProduct(product) {
            this.$parent.getJson(`${API_URL}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = product.id_product;
                        let find = this.cartItems.find(elem => elem.id_product === productId);
                        if (find) {
                            find.quantity++;
                            this.final_price += find.price;
                        } else {
                            let new_product = Object.assign({quantity: 1}, product);
                            this.cartItems.push(new_product);
                            this.final_price += new_product.price;
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        remove(product) {
            this.$parent.getJson(`${API_URL}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = product.id_product;
                        let find = this.cartItems.find(elem => elem.id_product === productId);
                        this.final_price -= find.price;
                        if (find.quantity > 1) {
                            find.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(find), 1);
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        mounted() {
            this.$parent.getJson(`${API_URL + this.cartUrl}`)
                .then(data => {
                    for (let el of data.contents) {
                        this.cartItems.push(el);
                    }
                });
        },
    },
    template: `
        <div v-show="isVisibleCart" class="cart-list">
            <div>
                <p class="cart-heading" v-if="!cartItems.length">Корзина пуста</p>
                <cart-item class="cart-item"
                           v-for="item of cartItems"
                           :key="item.id_product"
                           :cart-item="item"
                           :img="imgCart"
                           @remove="remove">
                           </cart-item>
            </div>
            <h1 v-if="cartItems.length" class="cart-heading">Всего товаров: {{amount}}</h1>
            <h1 v-if="cartItems.length" class="cart-heading">Итого: {{final_price}}</h1>
        </div>`
});

Vue.component('cart-item', {
    props: ['cartItem', 'img'],
    template: `
                    <div class="cart-item" :data-id="cartItem.id_product">
                        <div class="product-bio">
                            <figure><img :src="img" alt="product"></figure>
                            <figcaption>
                                <h3>{{cartItem.product_name}}</h3>
                                <p class="product-quantity">Кол-во: {{cartItem.quantity}}</p>
                                <p>Цена: {{cartItem.price}} за ед.</p>
                            </figcaption>
                        </div>
                        <div class="right-block">
                            <p class="product-price">{{cartItem.quantity * cartItem.price}}</p>
                            <button class="del-btn" @click="$emit('remove', cartItem); $parent.amount--">&#10006;</button>
                        </div>
                    </div>`
});