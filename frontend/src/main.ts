import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import App from "./App.vue";
import "./style.css";

const pinia = createPinia();
createApp(App).use(Vue3Toastify).use(pinia).use(VueQueryPlugin).mount("#app");
