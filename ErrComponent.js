Vue.component('error', {
    data() {
      return {
          isError: false,
      };
    },
    template: `<h3 v-show="isError">Возникла непредвиденная ошибка</h3>`,
});