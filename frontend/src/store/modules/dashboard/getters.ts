import { GetterTree } from "vuex";
import { RootState } from "@/store/types";
import { DashboardState } from "./types";

export const getters: GetterTree<DashboardState, RootState> = {
  horizon(state) {
    return state.horizon;
  },

  sharedOnly(state) {
    return state.sharedOnly;
  }
};
