import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@renderer/layouts/MainLayout"),
    children: [
      {
        path: "",
        redirect: "/service",
      },
      {
        path: "service",
        name: "service",
        component: () => import("@renderer/views/Service"),
        children: [
          {
            path: "youdaoWebNew",
            name: "youdaoWebNew",
            component: () => import("@renderer/components/translations/YoudaoWebNew"),
          },
          {
            path: "youdaoWebOld",
            name: "youdaoWebOld",
            component: () => import("@renderer/components/translations/YoudaoWebOld"),
          },
          {
            path: "youdaoZhiYun",
            name: "youdaoZhiYun",
            component: () => import("@renderer/components/translations/YoudaoZhiYun"),
          },
        ],
      },
      {
        path: "setting",
        name: "setting",
        component: () => import("@renderer/views/Setting"),
      },
      {
        path: "serviceConfig",
        name: "serviceConfig",
        component: () => import("@renderer/views/ServiceConfig"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
