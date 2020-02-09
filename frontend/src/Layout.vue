<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <main-menu />
      <template v-slot:append>
        <div class="pa-3">
          <v-btn @click="logout" color="primary" block>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import MainMenu from "./components/navigation/MainMenu.vue";

import Component from "vue-class-component";
import { Mutation, Action } from "vuex-class";
@Component({
  name: "App",
  components: {
    MainMenu
  }
})
export default class extends Vue {
  @Action("logout", { namespace: "user" }) logoutStore!: () => void;
  @Action("fetchUser", { namespace: "user" }) fetchUser!: () => void;
  drawer = null;

  beforeMount() {
    this.fetchUser();
  }

  async logout() {
    await this.logoutStore();
    this.$router.push({ name: "login" });
  }
}
</script>
