Vue.component('products',{
    data(){
        return {
            catalogUrl: '/catalogData.json',
            products: [],
            filtered: [],
            imgCatalog: 'https://placehold.it/150x150',
        }
    },
    methods: {
        filter() {
            const exp = new RegExp(this.$parent.searchLine, 'i');
            this.filtered = this.products.filter(product => exp.test(product.product_name));
        },
    },
    mounted() {
        this.$parent.getJson(`${API_URL + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                    this.filtered.push(el);
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    template: `<div class="goods-list">
                    <product v-for="item of filtered"
                             :key="item.id_product"
                             :img="imgCatalog"
                             :product="item">
                    </product>
                </div>`
});

Vue.component('product', {
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
});