// profile/index.ts
import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { UserState } from "./types";
import { RootState } from "../../types";

const namespaced: boolean = true;

const state: UserState = {
  user: undefined,
  access_token: localStorage.getItem("access_token") || ""
};

export const user: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
