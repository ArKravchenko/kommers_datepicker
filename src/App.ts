import {Component, Vue} from 'vue-property-decorator';
import Datepicker from './components/datepickerDefault/vueDatePick.vue';

@Component({
    components: {
        Datepicker,
    },
})
export default class App extends Vue {
    private date: string = '2018-12-29'
}