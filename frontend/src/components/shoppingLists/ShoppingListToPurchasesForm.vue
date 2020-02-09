<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Convert list to purchases
    </v-card-title>
    <v-card-text>
      <v-list class="mx-n5">
        <purchase-list-item
          v-for="purchase in purchases"
          :key="purchase.id"
          @click.stop="edit(purchase)"
          :options="options"
          :purchase="purchase"
        />
      </v-list>
      <v-card-text
        v-if="purchases.length == 0"
        class="title flex-column d-flex align-center"
      >
        <v-icon size="80">mdi-cart</v-icon>
        List empty
      </v-card-text>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')" text>Cancel</v-btn>
      <v-btn @click="submit" text :disabled="purchases.length == 0"
        >Convert</v-btn
      >
    </v-card-actions>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <purchase-form
        :purchase="dialogPurchase"
        @close="dialogVisible = false"
        :type="FormType.Edit"
        @submit="submitPurchase"
      />
    </v-dialog>
  </v-card>
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
import { ShoppingList } from "../../store/modules/shoppingList/types";
import { log } from "util";
import { Category } from "../../store/modules/category/types";
import { Shop } from "../../store/modules/shop/types";
import { Purchase } from "../../store/modules/purchase/types";
import PurchaseListItem from "../purchases/PurchaseListItem.vue";
import PurchaseForm from "../purchases/PurchaseForm.vue";
import _ from "lodash";
@Component({
  name: "ShoppingListToPurchasesForm",
  props: {
    shoppingList: Object as () => ShoppingList
  },
  components: {
    PurchaseForm,
    PurchaseListItem
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  shoppingList!: ShoppingList;
  purchases: Purchase[] = [];
  dialogPurchase: Purchase | null = null;
  dialogVisible: boolean = false;

  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"]
  };

  options = [
    {
      label: "Delete",
      action: (id: number, purchase: Purchase) => {
        this.delete(purchase);
      }
    }
  ];

  edit(purchase: Purchase) {
    this.dialogPurchase = purchase;
    this.dialogVisible = true;
  }

  delete(purchase: Purchase) {
    this.purchases = this.purchases.filter(p => p !== purchase);
  }

  submit() {
    const purchases = this.purchases;
    const shoppingList = this.shoppingList;
    this.$emit("submit", { purchases, shoppingList });
  }

  submitPurchase(purchase: Purchase) {
    _.merge(this.dialogPurchase, purchase);
    this.dialogVisible = false;
  }

  @Watch("shoppingList", { immediate: true })
  onShoppingListChanged() {
    this.purchases = [];
    if (this.shoppingList && this.shoppingList.items) {
      console.log(this.shoppingList);

      this.purchases = this.shoppingList.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: 0,
        date: moment().format("YYYY-MM-DD"),
        shopId: this.shoppingList.shop ? this.shoppingList.shop.id : undefined,
        shop:
          this.shoppingList.shop == null ? undefined : this.shoppingList.shop,
        category: this.shoppingList.shop
          ? this.shoppingList.shop.defaultCategory == null
            ? undefined
            : this.shoppingList.shop.defaultCategory
          : undefined,
        categoryId: this.shoppingList.shop
          ? this.shoppingList.shop.defaultCategory
            ? this.shoppingList.shop.defaultCategory.id
            : undefined
          : undefined,
        boughtBy:
          this.shoppingList.user == null ? undefined : this.shoppingList.user,
        boughtById: this.shoppingList.user
          ? this.shoppingList.user.id
          : undefined,
        isShared: this.shoppingList.shop
          ? this.shoppingList.shop.defaultCategory
            ? this.shoppingList.shop.defaultCategory.isShared
            : false
          : false // XD
      }));
    }
  }
}
</script>
