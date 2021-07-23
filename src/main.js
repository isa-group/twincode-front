import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/tailwind.css";
import VueRouter from "vue-router";
import routes from "./routes";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const DEFAULT_TITLE = "Twincode";

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

const socket = io(process.env.VUE_APP_TC_API);
Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
