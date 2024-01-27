
import { createRouter,createWebHashHistory } from "vue-router";

import index from "@/views/index.vue";
import upload from "@/views/upload.vue";
import pay from "@/views/pay.vue";
import print from "@/views/print.vue";

const routes = [
    {path: '/',component: index},
    {path: '/upload', component: upload},
    {path: '/pay', component: pay},
    {path: '/print', component: print}
];

const router = new createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
