// profile/index.ts
import { Module } from "vuex";
import { getters } from "./getters";
//import { actions } from "./actions";
import { mutations } from "./mutations";
import { DashboardState } from "./types";
import { RootState } from "../../types";
import moment from "moment";
const namespaced: boolean = true;

const state: DashboardState = {
  horizon: (() => {
    return (
      JSON.parse(localStorage.getItem("dashboardHorizon") || "false") || [
        moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        moment()
          .endOf("month")
          .format("YYYY-MM-DD")
      ]
    );
  })(),
  sharedOnly:
    JSON.parse(localStorage.getItem("dashboardSharedOnly") || "false") || false
};

export const dashboard: Module<DashboardState, RootState> = {
  namespaced,
  state,
  getters,
  //actions,
  mutations
};
