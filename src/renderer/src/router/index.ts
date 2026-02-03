import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@renderer/layouts/MainLayout"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@renderer/views/Home"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@renderer/views/Setting"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
