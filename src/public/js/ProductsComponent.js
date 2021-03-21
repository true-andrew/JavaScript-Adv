const products = {
    components: {
        product,
    },
    data() {
        return {
            catalogUrl: '/api/products',
            products: [],
            imgCatalog: 'https://placehold.it/150x150',
        }
    },
    mounted() {
        this.$parent.getJson(`${this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                    this.$root.$refs.search.filtered.push(el);
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    template: `<div class="goods-list">
                    <product v-for="item of this.$root.$refs.search.filtered"
                             :key="item.id_product"
                             :img="imgCatalog"
                             :product="item">
                    </product>
                </div>`
};

const product = {
    props: ['product', 'img'],
    data() {
        return {
            cartAPI: this.$root.$refs.cart,
        };
    },

    template: `
            <div class="good-item" :data-id="product.id_product">
                <img :src="img" alt="image">
                <div class="desc">
                    <h3>{{product.product_name}}</h3>
                    <p>{{product.price}}</p>
                    <button class="cart-button" @click="cartAPI.addProduct(product); cartAPI.amount++">Купить</button>
                </div>
            </div>`
};

export default products;