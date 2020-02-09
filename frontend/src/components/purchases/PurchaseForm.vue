<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Purchase
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" @keypress.enter="submit" action="">
        <v-row>
          <v-col :cols="12">
            <v-text-field
              v-model="editPurchase.name"
              label="Name"
              prepend-icon="mdi-format-text"
              :rules="rules.required"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editPurchase.price"
              label="Price"
              prepend-icon="mdi-cash"
              :rules="rules.required"
              type="number"
            >
            </v-text-field>
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editPurchase.quantity"
              label="Quantity"
              prepend-icon="mdi-scale"
              :rules="rules.required"
              type="number"
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
              v-model="editPurchase.shopId"
              label="Shop"
              prepend-icon="mdi-store"
              :rules="rules.required"
              @input="shopInput"
            />
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-select
              :items="categories"
              item-text="name"
              item-value="id"
              v-model="editPurchase.categoryId"
              label="Category"
              prepend-icon="mdi-shape"
              :rules="rules.required"
              @change="
                editPurchase.category = categories.find(
                  c => c.id == editPurchase.categoryId
                )
              "
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-select
              :items="users"
              :item-text="user => `${user.firstname} ${user.surname}`"
              item-value="id"
              v-model="editPurchase.boughtById"
              label="Bought by"
              prepend-icon="mdi-cart"
              :rules="rules.required"
            />
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-select
              :items="users"
              :item-text="user => `${user.firstname} ${user.surname}`"
              item-value="id"
              v-model="editPurchase.boughtForId"
              label="Bought for"
              prepend-icon="mdi-cart-arrow-right"
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-menu
              v-model="datepicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="editPurchase.date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  :rules="rules.required"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editPurchase.date"
                @input="datepicker = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col :cols="12" :md="6">
            <v-checkbox v-model="editPurchase.isShared" label="Shared" />
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
import { Purchase } from "../../store/modules/purchase/types";
import { Category } from "../../store/modules/category/types";
import { Shop } from "../../store/modules/shop/types";
@Component({
  name: "PurchaseForm",
  props: {
    purchase: Object as () => Purchase | null,
    type: String
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  purchase!: Purchase | null;
  @Getter("user", { namespace: "user" }) loggedUser!: User;
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  editPurchase: Purchase | null = null;
  categories: Category[] = [];
  users: User[] = [];
  shops: Shop[] = [];
  valid: boolean = false;
  datepicker: boolean = false;
  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"]
  };

  submit() {
    if (this.$refs.form) {
      (this.$refs.form as any).validate();
      if (this.valid) {
        if (this.editPurchase && !this.editPurchase.boughtForId) {
          this.editPurchase.boughtForId = null;
        }
        this.$emit("submit", this.editPurchase);
      }
    }
  }
  shopInput(shopId: number) {
    if (this.editPurchase) {
      const shop = this.shops.find(s => s.id == shopId);
      if (shop) {
        const category = this.categories.find(
          c => shop.defaultCategory && c.id == shop.defaultCategory.id
        );
        if (category) {
          this.editPurchase.categoryId = category.id;
          this.editPurchase.isShared = category.isShared;
        }
      }
    }
  }

  fetchDependencies() {
    axios
      .get("categories", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.categories = response.data;
      });
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

  @Watch("purchase", { immediate: true })
  onPurchaseChanged() {
    if (this.purchase) {
      const shop = this.purchase.shop;
      const category = this.purchase.category;
      this.editPurchase = {
        ...(this as any).purchase,
        shopId: shop ? shop.id : undefined,
        categoryId: category ? category.id : undefined,
        boughtBy: this.purchase.boughtBy,
        boughtById: this.purchase.boughtById,
        boughtFor: this.purchase.boughtFor,
        boughtForId: this.purchase.boughtForId,
        date: moment((this as any).purchase.date).format("YYYY-MM-DD")
      };
    }
  }
}
</script>
