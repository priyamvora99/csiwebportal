import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase';
import VueRouter from 'vue-router'
import Routes from './routes';
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import JsonExcel from 'vue-json-excel'
import XLSX from 'xlsx'

Vue.component('downloadExcel', JsonExcel);



//Router initialization
Vue.use(VueRouter);

//Vue Resource initialization
Vue.use(VueResource);

//BootStrap Vue
Vue.use(BootstrapVue);

Vue.use(Vuetify);


//Router object
const router=new VueRouter({
  routes:Routes,
  mode:'history'
});



//Firebase configuration details!
var config = {
  apiKey: "AIzaSyAK4u-fDv6geisMAyAkWhELnKcPRbx6XXc",
  authDomain: "djcsi-3e43d.firebaseapp.com",
  databaseURL: "https://djcsi-3e43d.firebaseio.com",
  projectId: "djcsi-3e43d",
  storageBucket: "djcsi-3e43d.appspot.com",
  messagingSenderId: "464789121303"
};
firebase.initializeApp(config);

new Vue({
  el: '#app',
  render: h => h(App),
  router:router
})
