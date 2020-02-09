<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Shopping list
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" @keypress.enter="submit" action="">
        <v-row>
          <v-col :cols="12">
            <v-text-field
              v-model="editShoppingList.name"
              label="Name"
              prepend-icon="mdi-format-text"
              :rules="rules.required"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-select
              :items="shops"
              item-text="name"
              item-value="id"
              v-model="editShoppingList.shopId"
              label="Shop"
              prepend-icon="mdi-store"
              clearable
            />
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-select
              :items="users"
              :item-text="user => `${user.firstname} ${user.surname}`"
              item-value="id"
              v-model="editShoppingList.userId"
              label="User"
              prepend-icon="mdi-account"
              clearable
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')" text>Cancel</v-btn>
      <v-btn @click="submit" text>Save</v-btn>
    </v-card-actions>
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
@Component({
  name: "ShoppingListForm",
  props: {
    shoppingList: Object as () => ShoppingList | null,
    type: String
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  editShoppingList: ShoppingList | null = null;
  users: User[] = [];
  shops: Shop[] = [];
  valid: boolean = false;

  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"]
  };

  submit() {
    if (this.$refs.form) {
      (this.$refs.form as any).validate();
      if (this.valid && this.editShoppingList) {
        if (!this.editShoppingList.userId) {
          this.editShoppingList.userId = null;
          this.editShoppingList.user = null;
        }
        if (!this.editShoppingList.shopId) {
          this.editShoppingList.shopId = null;
          this.editShoppingList.shop = null;
        }
        this.$emit("submit", this.editShoppingList);
      }
    }
  }

  fetchDependencies() {
    axios
      .get("shops", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.shops = response.data;
      });
    axios
      .get("users", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.users = response.data;
      });
  }

  mounted() {
    this.fetchDependencies();
  }

  @Watch("shoppingList", { immediate: true })
  onShoppingListChanged() {
    const user = (this as any).shoppingList.user;
    const shop = (this as any).shoppingList.shop;
    this.editShoppingList = {
      ...(this as any).shoppingList,
      user: user || undefined,
      userId: user ? user.id : undefined,
      shop: shop || undefined,
      shopId: shop ? shop.id : undefined
    };
  }
}
</script>
