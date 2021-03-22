import cart from "./CartComponent";
import products from "./ProductsComponent";
import search from "./FilterComponent";
import error from "./ErrComponent";

const app = {
    el: '#app',
    components: {
        'cart': cart,
        'products': products,
        'search': search,
        'error': error,
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(response => response.json())
                .catch(error => {
                    this.$root.$refs.error.setError(error);
                    console.log(error);
                });
        },

        postJson(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
                .catch(error => {
                    this.$root.$refs.error.setError(error);
                });
        },

        putJson(url, data) {
            return fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
                .catch(error => {
                    this.$root.$refs.error.setError(error);
                })
        },

        deleteJson(url, data) {
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
                .catch(error => {
                    this.$root.$refs.error.setError(error);
                });
        },
    },
    template: `
     <div>
     <header>
        <h1 class="shop-heading">Shop</h1>
        <search ref="search"></search>
        <button type="button" class="cart-button" @click="$root.$refs.cart.isVisibleCart=!$root.$refs.cart.isVisibleCart">Корзина</button>
    </header>
    <main>
        <cart ref="cart"></cart>
        <products ref="products"></products>
    </main>
    <error ref="error"></error>
</div>   
    `,
    mounted() {
        console.log(this);
    }

};

export default app;