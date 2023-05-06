import { createRouter, createWebHistory } from "vue-router";
import Calendar from "@/components/Calendar/index.vue";
import Elements from "@/components/Elements/index.vue";
import Settings from "@/components/Settings/index.vue";
import FTL from "@/components/FluorescenceTransientLife/index.vue";
import ColorTemperature from "@/components/ColorTemperature/index.vue";
import IVCurve from "@/components/IVCurve/index.vue";
import Chat from "@/components/ChatGPT/index.vue";
const routes: any = [
  {
    path: "/",
    redirect: {
      path: "/calendar",
    },
    children: [
      {
        path: "/calendar",
        component: Calendar,
      },
      {
        path: "/elements",
        component: Elements,
      },
      {
        path: "/fluorescence-transient-life",
        component: FTL,
      },
      {
        path: "/color-temperature",
        component: ColorTemperature,
      },
      {
        path: "/iv-curve",
        component: IVCurve,
      },
      {
        path: "/chat",
        component: Chat,
      },
      {
        path: "/settings",
        component: Settings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
