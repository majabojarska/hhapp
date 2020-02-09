<template>
  <v-container>
    <v-row flex>
      <v-col class="col-auto">
        <v-avatar :color="avatarColor">
          <span
            :class="[TextService.textColorClass(user ? user.color : 'black')]"
            >{{ initials }}</span
          >
        </v-avatar>
      </v-col>
      <v-col>
        <p class="title mt-2">{{ name }}</p>
      </v-col>
    </v-row>
    <v-list dense>
      <v-list-item
        v-for="position in menu"
        :to="position.link"
        :key="position.link"
      >
        <v-list-item-action>
          <v-icon>{{ position.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ position.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import Component from "vue-class-component";
import { Action, Getter } from "vuex-class";
import { User } from "../../store/modules/user/types";
import UserService from "../../store/modules/user/services/UserService";
import TextService from "../../common/services/TextService";
@Component({
  name: "MainMenu",
  data: () => ({
    UserService,
    TextService
  })
})
export default class extends Vue {
  @Getter("user", { namespace: "user" }) user!: User;
  get name() {
    if (this.user) {
      return `${this.user.firstname} ${this.user.surname}`;
    } else return "";
  }
  get avatarColor() {
    return this.user ? this.user.color : "primary";
  }
  get initials() {
    return UserService.getInitials(this.user);
  }

  menu = [
    {
      title: "Dashboard",
      icon: "mdi-view-dashboard",
      link: "/"
    },
    {
      title: "Purchases",
      icon: "mdi-cart",
      link: "/purchases"
    },
    {
      title: "Categories",
      icon: "mdi-shape",
      link: "/categories"
    },
    {
      title: "Shops",
      icon: "mdi-store",
      link: "/shops"
    },
    {
      title: "Shopping lists",
      icon: "mdi-clipboard-list",
      link: "/shoppinglists"
    },
    {
      title: "Expenses",
      icon: "mdi-cash-multiple",
      link: "/expenses"
    },
    {
      title: "Bills",
      icon: "mdi-gauge",
      link: "/bills"
    },
    {
      title: "Bill rules",
      icon: "mdi-calculator",
      link: "/billCalcRules"
    },
    {
      title: "Users",
      icon: "mdi-account-multiple",
      link: "/users"
    }
  ];
}
</script>
