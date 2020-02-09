import { MutationTree } from "vuex";
import { DashboardState } from "./types";
import { RootState } from "@/store/types";

export const mutations: MutationTree<DashboardState> = {
  setHorizon(state: DashboardState, payload: [string, string]) {
    state.horizon = payload;
    localStorage.setItem("dashboardHorizon", JSON.stringify(payload));
  },

  setSharedOnly(state: DashboardState, payload: boolean) {
    state.sharedOnly = payload;
    localStorage.setItem("dashboardSharedOnly", JSON.stringify(payload));
  }
};
