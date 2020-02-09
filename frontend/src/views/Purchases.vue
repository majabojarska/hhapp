<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="purchases.length > 0">
      <v-list>
        <purchase-list-item
          v-for="purchase in purchases"
          :key="purchase.id"
          @click.stop="edit(purchase)"
          :options="options"
          :purchase="purchase"
        />
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
        <v-icon size="80">mdi-cart</v-icon>
        List empty
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <purchase-form
        :purchase="dialogPurchase"
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
import { Purchase } from "../store/modules/purchase/types";
import TextService from "../common/services/TextService";
import axios, { AxiosResponse } from "axios";
import { FormType } from "../common/enums";
import PurchaseForm from "../components/purchases/PurchaseForm.vue";
import PurchaseListItem from "../components/purchases/PurchaseListItem.vue";
import { log } from "util";
import moment from "moment";
@Component({
  name: "Purchases",
  components: {
    PurchaseForm,
    PurchaseListItem
  }
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  purchases: Purchase[] = [];
  dialogPurchase: Purchase | null = null;
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

  fetchPurchases() {
    axios
      .get("purchases", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.purchases = response.data;
      });
  }

  edit(purchase: Purchase) {
    this.formType = FormType.Edit;
    let boughtById = null;
    if (purchase.boughtBy) {
      boughtById = purchase.boughtBy.id;
    }
    let boughtForId = null;
    if (purchase.boughtFor) {
      boughtForId = purchase.boughtFor.id;
    }
    this.dialogPurchase = {
      ...purchase,
      boughtById: boughtById,
      boughtForId: boughtForId
    };
    this.dialogVisible = true;
  }

  create() {
    console.log(this.dialogVisible);

    this.formType = FormType.Create;
    this.dialogPurchase = {
      name: "",
      date: moment().format("YYYY-MM-DD"),
      price: 0,
      isShared: true
    };
    this.dialogVisible = true;
  }

  submit(purchase: Purchase) {
    delete purchase.category;
    delete purchase.shop;
    delete purchase.boughtBy;
    delete purchase.boughtFor;
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("purchases", purchase, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchPurchases();
            this.showSnackbar("Purchase created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        console.log(purchase);
        axios
          .put(`purchases/${purchase.id}`, purchase, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchPurchases();
            this.showSnackbar("Purchase updated!");
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
      .delete(`purchases/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Purchase deleted.");
        this.fetchPurchases();
      })
      .catch(error => {
        if (error.response.status == 406) {
          this.showSnackbar(
            "Cannot delete purchase! Other items depend on it."
          );
        }
      });
  }

  mounted() {
    this.fetchPurchases();
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }
}
</script>
