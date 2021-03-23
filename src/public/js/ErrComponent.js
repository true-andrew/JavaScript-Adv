const error = {
    data() {
        return {
            isError: false,
            errorMessage: '',
        };
    },

    methods: {
        setError(err) {
            this.isError = true;
            this.errorMessage = err;
            console.log(err);
        }
    },

    template: `<h3 v-show="isError">Возникла ошибка: {{errorMessage}}</h3>`,

};

export default error;