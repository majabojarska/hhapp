import Vue from "vue";
import Vuex from "vuex";
import { user } from "./modules/user/index";
import { dashboard } from "./modules/dashboard/index";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { user, dashboard }
});
