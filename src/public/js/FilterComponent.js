const search = {
    data() {
        return {
            filtered: [],
            searchLine: '',
        };
    },
    methods: {
        filter() {
            const exp = new RegExp(this.searchLine, 'i');
            this.filtered = this.$root.$refs.products.products.filter(product => exp.test(product.product_name));
        },
    },
    template: `<form class="search">
                    <input type="text" class="goods-search" v-model="searchLine"/>
                    <button class="search-button btn btn-light" type="submit" @click.prevent="filter">Искать
                    </button>
                </form>`
};

export default search;