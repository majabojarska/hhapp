<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Shop
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" @keypress.enter="submit" action="">
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editShop.name"
              label="Name"
              prepend-icon="mdi-format-text"
              :rules="rules.required"
            >
            </v-text-field>
          </v-col>
          <v-col class="d-flex justify-start align-center" :cols="12" :sm="6">
            <v-icon class="mr-2">mdi-palette</v-icon>
            <v-color-picker
              class="flex-grow-1"
              v-model="editShop.color"
              hide-canvas
              hide-inputs
              hide-swatches
            ></v-color-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-select
              :items="categories"
              item-text="name"
              item-value="id"
              v-model="editShop.defaultCategoryId"
              label="Default category"
              prepend-icon="mdi-shape"
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
import { Shop } from "../../store/modules/shop/types";
import { log } from "util";
import { Category } from "../../store/modules/category/types";
@Component({
  name: "ShopForm",
  props: {
    shop: Object as () => Shop | null,
    type: String
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  editShop: Shop | null = null;
  categories: Category[] = [];
  valid: boolean = false;

  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"]
  };

  submit() {
    if (this.$refs.form) {
      (this.$refs.form as any).validate();
      if (this.valid) {
        if (this.editShop && !this.editShop.defaultCategoryId) {
          this.editShop.defaultCategoryId = null;
        }
        this.$emit("submit", this.editShop);
      }
    }
  }

  fetchCategories() {
    axios
      .get("categories", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.categories = response.data;
      });
  }

  mounted() {
    this.fetchCategories();
  }

  @Watch("shop", { immediate: true })
  onShopChanged() {
    const defaultCategory = (this as any).shop.defaultCategory;
    this.editShop = {
      ...(this as any).shop,
      defaultCategory: defaultCategory ? defaultCategory : undefined,
      defaultCategoryId: defaultCategory ? defaultCategory.id : undefined
    };
  }
}
</script>
