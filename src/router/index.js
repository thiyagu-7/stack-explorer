import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import StackExplorerInput from "@/components/StackExplorerInput.vue";
import Questions from "@/components/Questions.vue";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/input",
    name: "StackExplorerInput",
    component: StackExplorerInput
  },
  {
    path: "/questions",
    name: "Questions",
    component: Questions,
    props: (route) => (questionProps(route))
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

function questionProps(route) {
  let params = {
    from: Number(route.query.from),
    to: Number(route.query.to),
    minVotes: Number(route.query.minvotes),
    tags: route.query.tags
  }
  addIfTruthy(params, "page", Number(route.query.page))
  addIfTruthy(params, "pageSize", Number(route.query.pagesize))
  return params;
}

function addIfTruthy(obj, key, value) {
  if (value) {
    obj[key] = value;
  }
}

export default router;