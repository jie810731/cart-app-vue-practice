<template>
  <div id="cart-app" class="container">
    <div class="row">
      <div class="col-md-8">
        <h1 class="page-header">
          VUEJS 實戰 -
          <small>5倍商城</small>
        </h1>

        <div
          class="item"
          v-for="(item, index) in filterItems.slice(pageStart,pageStart + countOfPage)"
          :key="item._id"
        >
          <h2>{{index}} {{item.name}}</h2>
          <img class="item-img img-responsive" :src="item.picture" :alt="item.name" />
          <p>{{item.info}}</p>
          <p class="item-price">$ {{item.price}}</p>
          <a @click.prevent="addItem(item._id)" class="btn btn-primary" href="# ">
            放入購物車
            <span class="glyphicon glyphicon-chevron-right"></span>
          </a>
        </div>

        <hr />

        <!--Pager -->
        <ul class="pagination">
          <li @click.prevent="setPage(currentPage - 1)">
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li
            v-for="index in totalPage"
            :key="index"
            @click.prevent="setPage(index)"
            :class="{active: index===currentPage}"
          >
            <a href="#">{{index}}</a>
          </li>

          <li @click.prevent="setPage(currentPage + 1)">
            <a href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Blog Sidebar Widgets Column -->
      <div class="col-md-4">
        <div class="well">
          <h4>商品搜尋</h4>
          <div class="input-group">
            <input type="text" class="form-control" v-model="searchName" />
            <span class="input-group-btn">
              <button class="btn btn-default">
                <span class="glyphicon glyphicon-search"></span>
              </button>
            </span>
          </div>
          <!-- /.input-group -->
        </div>

        <hr />

        <div class="well cart">
          <h4>購物車</h4>

          <ul class="itemsInCart">
            <li v-for="car in cars" :key="car.index">
              <div class="cart-item">
                <div class="cart-title">{{car.name}}</div>
                <span class="price">$ {{car.price}}</span> x
                <span class="count">{{car.qty}}</span>
                <div class="handler">
                  <a @click.prevent="plus(car)" href="#" class="cart-btn plus">+</a>
                  <a @click.prevent="minus(car)" href="#" class="cart-btn minus">-</a>
                </div>
              </div>
            </li>
          </ul>
          <hr />
          <p>
            小計：
            <span>$ {{totalPrice}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- /.row -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      items: [],
      cars: [],
      searchName: "",
      countOfPage: 10,
      currentPage: 1,
      totalPrice: 0
    };
  },
  computed: {
    filterItems() {
      return this.items.filter(d =>
        d.name.toLowerCase().includes(this.searchName.toLowerCase())
      );
    },
    totalPage() {
      return Math.ceil(this.filterItems.length / this.countOfPage);
    },
    pageStart() {
      return (this.currentPage - 1) * this.countOfPage;
    }
  },
  created() {
    axios.get("http://localhost:9090/ItemList").then(res => {
      this.items = res.data;
    });
  },
  methods: {
    setPage(page) {
      if (page > 0 && page <= this.totalPage) {
        this.currentPage = page;
      }
    },
    addItem(_id) {
      let item = this.items.find(item => item._id == _id);
      let find_indx = this.cars.findIndex(cart => cart._id == item._id);

      this.totalPrice += item.price;
      if (find_indx > -1) {
        this.cars[find_indx].qty += 1;
      } else {
        this.cars.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          qty: 1
        });
      }
    },
    plus(item) {
      item.qty += 1;
      this.totalPrice += item.price;
    },
    minus(item) {
      item.qty -= 1;
      this.totalPrice -= item.price;

      if (item.qty == 0) {
        this.cars = this.cars.filter(car => car._id != item._id);
      }
    }
  }
};
</script>