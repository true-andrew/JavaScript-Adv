const error = {
    data() {
        return {
            isError: false,
            error: '',
        };
    },

    methods: {
        setError(err) {
            this.isError = true;
            this.error = err;
        }
    },
    template: `<h3 v-show="isError">Возникла ошибка ${this.error}</h3>`,
};

export default error;