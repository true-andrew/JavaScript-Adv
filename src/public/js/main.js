import cart from "./CartComponent";
import products from "./ProductsComponent";
import search from "./FilterComponent";
import error from "./ErrComponent";

const app = new Vue({
    el: '#app',
    components: {
        cart,
        products,
        search,
        error,
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
                    this.$root.$refs.setError(error);
                });
        },
    },
    mounted() {
        console.log(this);
    }
});

export default app;