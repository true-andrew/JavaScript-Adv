const cart = {
    components: {
        cart_item,
    },
    data() {
        return {
            imgCart: 'https://placehold.it/150x150',
            cartUrl: '/api/cart',
            cartItems: [],
            isVisibleCart: false,
            final_price: 0,
            amount: 0,
        }
    },
    methods: {
        addProduct(product) {
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            if (find) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, {
                    quantity: 1,
                    price: find.price,
                    product_name: `${find.product_name}`
                });
                find.quantity++;
                this.final_price += find.price;
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.final_price += prod.price;
                this.$parent.postJson('/api/cart', prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.push(prod);
                        }
                    });
            }
        },
        removeProduct(product) {
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            this.final_price -= find.price;
            if (find.quantity > 1) {
                this.$parent.deleteJson(`/api/cart/${find.id_product}`, {
                    quantity: 1,
                    price: find.price,
                    product_name: `${find.product_name}`
                });
                find.quantity--;
            } else {
                this.$parent.deleteJson(`/api/cart/${find.id_product}`, {
                    quantity: 1,
                    price: find.price,
                    product_name: `${find.product_name}`
                })
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.splice(this.cartItems.indexOf(find), 1);
                        }
                    });
            }
        },
    },
    mounted() {
        this.$parent.getJson(`${this.cartUrl}`)
            .then(data => {
                if (data.hasOwnProperty('final_price') && data.hasOwnProperty('amount')) {
                    this.final_price = data.final_price;
                    this.amount = data.amount;
                }
                for (let el of data.contents) {
                    this.cartItems.push(el);
                }
            }).catch(err => {
            console.log(err);
        })
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
                           @remove="removeProduct">
                           </cart-item>
            </div>
            <h1 v-if="cartItems.length" class="cart-heading">Всего товаров: {{amount}}</h1>
            <h1 v-if="cartItems.length" class="cart-heading">Итого: {{final_price}}</h1>
        </div>`
};

const cart_item = {
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
};

export default cart;