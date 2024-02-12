import { BaseForm } from './components/base_form.component.js';

const app = Vue.createApp({
    components: {
        'base-form': BaseForm
    }
});

app.mount('#app');