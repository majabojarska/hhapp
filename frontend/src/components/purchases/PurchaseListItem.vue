<template>
  <v-list-item @click="e => $emit('click', e)">
    <v-list-item-avatar :color="avatarColor">
      <span :class="[TextService.textColorClass(avatarColor)]">
        {{ purchase.name[0].toUpperCase() }}</span
      >
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        {{ purchase.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        <span class="mr-4" v-if="purchase.category">
          <v-icon small>mdi-shape</v-icon>
          {{ purchase.category.name }}
        </span>
        <span v-if="purchase.date">
          <v-icon small>mdi-calendar</v-icon>
          {{ purchase.date | date }}
        </span>
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        <v-icon small>mdi-cash</v-icon>
        {{ `${purchase.price} &middot; ${purchase.quantity} = ` }}
        {{ (purchase.price * purchase.quantity) | price }} PLN
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action @click.stop>
      <v-menu bottom left @click.stop>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="option in options"
            :key="option.label"
            @click.stop="option.action(purchase.id, purchase)"
          >
            <v-list-item-title>{{ option.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-action>
  </v-list-item>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios, { AxiosResponse } from "axios";
import { User, UserDecorated } from "../../store/modules/user/types";
import { Getter } from "vuex-class";
import moment from "moment";
import { Watch } from "vue-property-decorator";
import { FormType } from "../../common/enums";
import { Purchase } from "../../store/modules/purchase/types";
import { Category } from "../../store/modules/category/types";
import { Shop } from "../../store/modules/shop/types";
import TextService from "../../common/services/TextService";
@Component({
  name: "PurchaseListItem",
  props: {
    purchase: Object as () => Purchase,
    options: Array
  },
  data: () => ({
    TextService
  }),
  filters: {
    date(date: string) {
      return moment(date).format("YYYY-MM-DD");
    },
    price(price: number) {
      return Math.round(price * 100) / 100;
    }
  }
})
export default class extends Vue {
  purchase!: Purchase;

  get avatarColor() {
    return this.purchase.category ? this.purchase.category.color : "black";
  }
}
</script>
