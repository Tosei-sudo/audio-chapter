import Vue from 'vue';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import audiochapter from './app';

Vue.use(VuejsDialog);

const app = new Vue({
    components: {
        'audio-chapter': audiochapter
    },
    el: "#app",
});