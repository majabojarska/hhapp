import Vue from "vue";
import VueRouter, { RouteConfig, Route } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Users from "../views/Users.vue";
import Login from "../views/Login.vue";
import Layout from "../Layout.vue";
import BillCalcRules from "../views/BillCalcRules.vue";
import Categories from "../views/Categories.vue";
import Expenses from "../views/Expenses.vue";
import Shops from "../views/Shops.vue";
import ShoppingLists from "../views/ShoppingLists.vue";
import Bills from "../views/Bills.vue";
import Purchases from "../views/Purchases.vue";
import store from "../store";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "dashboard",
        meta: {
          title: "Dashboard"
        },
        component: Dashboard
      },
      {
        path: "users",
        name: "users",
        component: Users,
        meta: {
          title: "Users"
        }
      },
      {
        path: "billCalcRules",
        name: "billCalcRules",
        component: BillCalcRules,
        meta: {
          title: "Bill rules"
        }
      },
      {
        path: "bills",
        name: "bills",
        component: Bills,
        meta: {
          title: "Bills"
        }
      },
      {
        path: "categories",
        name: "categories",
        component: Categories,
        meta: {
          title: "Categories"
        }
      },
      {
        path: "expenses",
        name: "expenses",
        component: Expenses,
        meta: {
          title: "Expenses"
        }
      },
      {
        path: "shops",
        name: "shops",
        component: Shops,
        meta: {
          title: "Shops"
        }
      },
      {
        path: "purchases",
        name: "purchases",
        component: Purchases,
        meta: {
          title: "Purchases"
        }
      },
      {
        path: "shoppingLists",
        name: "shoppingLists",
        component: ShoppingLists,
        meta: {
          title: "Shopping lists"
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Login",
      guest: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to: Route, from: Route, next) => {
  if (to.meta.guest && !store.getters["user/isLoggedIn"]) next();
  else {
    if (store.getters["user/isLoggedIn"]) {
      if (to.name == "login") next({ path: "/" });
      else next();
    } else {
      next({
        path: "/login"
      });
    }
  }
});

router.afterEach((to: Route, from: Route) => {
  document.title = `HouseholdApp - ${to.meta.title || ""}`;
});
export default router;
