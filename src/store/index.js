import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [],
    cars: [],
    searchName: "",
    countOfPage: 10,
    currentPage: 1,
    totalPrice: 0
  },
  getters: {
    filterItems: (state, getters) => {
      return state.items.filter(d =>
        d.name.toLowerCase().includes(state.searchName.toLowerCase())
      );
    },
    totalPage: (state, getters) => {
      return Math.ceil(getters.filterItems.length / state.countOfPage);
    },
    pageStart: (state, getters) => {
      return (state.currentPage - 1) * state.countOfPage;
    }
  },
  mutations: {
    setItems(state,val){
      state.items = val
    }
  },
  actions: {
    getItems(context){
      axios.get("http://localhost:9090/ItemList").then(res => {
        context.commit('setItems',res.data);
      });
    }
  },
  modules: {
  }
})
