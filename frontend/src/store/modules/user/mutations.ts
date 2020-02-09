import { MutationTree } from "vuex";
import { UserState, User } from "./types";

export const mutations: MutationTree<UserState> = {
  setAccessToken(state, token) {
    state.access_token = token;
    localStorage.setItem("access_token", token);
  },
  logout(state) {
    state.user = undefined;
    state.access_token = "";
    localStorage.removeItem("access_token");
  },
  setUser(state, user: User) {
    state.user = user;
  }
};
