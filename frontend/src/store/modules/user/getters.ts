import { GetterTree } from "vuex";
import { UserState } from "./types";
import { RootState } from "@/store/types";
import { user } from ".";
import UserService from "./services/UserService";

export const getters: GetterTree<UserState, RootState> = {
  isLoggedIn(state: UserState) {
    return !!state.access_token;
  },

  authHeader(state: UserState) {
    return `Bearer ${state.access_token}`;
  },

  user(state: UserState) {
    return state.user;
  }
};
