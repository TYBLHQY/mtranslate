import { serviceOptions } from "@common/types";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const serviceRoutes = [
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
  {
    path: "deepLProSYG",
    name: "deepLProSYG",
    component: () => import("@renderer/components/translations/DeepLProSYG"),
  },
] as const satisfies Array<
  Omit<RouteRecordRaw, "name" | "path"> & {
    name: keyof typeof serviceOptions;
    path: keyof typeof serviceOptions;
  }
>;

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
        children: serviceRoutes,
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
