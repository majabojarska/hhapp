<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="shops.length > 0">
      <v-list>
        <v-list-item
          v-for="shop in shops"
          :key="shop.id"
          @click.stop="edit(shop)"
        >
          <v-list-item-avatar :color="shop.color">
            <span :class="[TextService.textColorClass(shop.color)]">
              {{ shop.name[0].toUpperCase() }}</span
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ shop.name }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="shop.defaultCategory">
              <v-icon small>mdi-shape</v-icon>
              {{ shop.defaultCategory.name }}
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
                  @click.stop="option.action(shop.id)"
                >
                  <v-list-item-title>{{ option.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-snackbar v-model="snackbarVisible">
        {{ snackbarMessage }}
        <v-btn dark @click="snackbarVisible = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-card>
    <v-card v-else>
      <v-card-text class="title flex-column d-flex align-center">
        <v-icon size="80">mdi-store</v-icon>
        List empty
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <shop-form
        :shop="dialogShop"
        @close="dialogVisible = false"
        :type="formType"
        @submit="submit"
      />
    </v-dialog>
    <v-btn @click="create" color="primary" fab fixed right bottom>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";
import Component from "vue-class-component";
import { Action, Getter } from "vuex-class";
import { Shop } from "../store/modules/shop/types";
import TextService from "../common/services/TextService";
import axios, { AxiosResponse } from "axios";
import { FormType } from "../common/enums";
import ShopForm from "../components/shops/ShopForm.vue";
import { log } from "util";
@Component({
  name: "Shops",
  components: {
    ShopForm
  },
  data: () => ({
    TextService
  })
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  shops: Shop[] = [];
  dialogShop: Shop | null = null;
  dialogVisible: boolean = false;
  snackbarVisible: boolean = false;
  snackbarMessage: string = "";
  formType: FormType = FormType.Edit;

  options = [
    {
      label: "Delete",
      action: (id: number) => {
        this.delete(id);
      }
    }
  ];

  fetchShops() {
    axios
      .get("shops", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.shops = response.data;
      });
  }

  edit(shop: Shop) {
    this.formType = FormType.Edit;
    this.dialogShop = { ...shop };
    this.dialogVisible = true;
  }

  create() {
    console.log(this.dialogVisible);

    this.formType = FormType.Create;
    this.dialogShop = {
      name: "",
      color: "#BADA55"
    };
    this.dialogVisible = true;
  }

  submit(shop: Shop) {
    delete shop.defaultCategory;
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("shops", shop, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchShops();
            this.showSnackbar("Shop created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        axios
          .put(`shops/${shop.id}`, shop, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchShops();
            this.showSnackbar("Shop updated!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      }
    }
  }

  delete(id: number) {
    axios
      .delete(`shops/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Shop deleted.");
        this.fetchShops();
      })
      .catch(error => {
        if (error.response.status == 406) {
          this.showSnackbar("Cannot delete shop! Other items depend on it.");
        }
      });
  }

  mounted() {
    this.fetchShops();
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }
}
</script>
