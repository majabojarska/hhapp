import { ActionTree } from "vuex";
import { UserState, TokenPayload } from "./types";
import { RootState } from "@/store/types";
import axios, { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
export const actions: ActionTree<UserState, RootState> = {
  login(context, { username, password }) {
    return axios
      .post("session", { username, password })
      .then((response: AxiosResponse) => {
        context.commit("setAccessToken", response.data.access_token);
        return Promise.resolve();
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },

  async logout(context) {
    await axios.delete("session", {
      headers: {
        Authorization: context.getters.authHeader
      }
    });
    context.commit("logout");
  },

  fetchUser(context) {
    const tokenDecoded: TokenPayload = jwt.decode(
      context.state.access_token
    ) as any;
    axios
      .get(`users/${tokenDecoded.sub}`, {
        headers: {
          Authorization: context.getters.authHeader
        }
      })
      .then((response: AxiosResponse) => {
        context.commit("setUser", response.data);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
