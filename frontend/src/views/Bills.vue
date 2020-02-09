<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="bills.length > 0">
      <v-list>
        <v-list-item
          v-for="bill in bills"
          :key="bill.id"
          @click.stop="edit(bill)"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ bill.billCalcRule.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text--primary">
              <v-icon small>mdi-calendar</v-icon>
              {{ bill.dateFrom | date }} -
              {{ bill.dateTo | date }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-icon small>mdi-cash</v-icon>
              {{
                `${bill.value} ${bill.billCalcRule.unit} &middot; ${bill.billCalcRule.pricePerUnit} = `
              }}
              {{ (bill.value * bill.billCalcRule.pricePerUnit) | price }} PLN
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
                  @click.stop="option.action(bill.id)"
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
        <v-icon size="80">mdi-gauge</v-icon>
        List empty
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <bill-form
        :bill="dialogBill"
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
import { Bill } from "../store/modules/bill/types";
import axios, { AxiosResponse } from "axios";
import { FormType } from "../common/enums";
import BillForm from "../components/bills/BillForm.vue";
import moment from "moment";
@Component({
  name: "Bills",
  components: {
    BillForm
  },
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
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  bills: Bill[] = [];
  dialogBill: Bill | null = null;
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

  fetchbills() {
    axios
      .get("bills", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.bills = response.data;
      });
  }

  edit(bill: Bill) {
    this.formType = FormType.Edit;
    this.dialogBill = { ...bill };
    this.dialogVisible = true;
  }

  create() {
    this.formType = FormType.Create;
    this.dialogBill = {
      dateFrom: moment().format("YYYY-MM-DD"),
      dateTo: moment().format("YYYY-MM-DD"),
      value: 0
    };
    this.dialogVisible = true;
  }

  submit(bill: Bill) {
    bill.value = Number(bill.value);
    delete bill.user;
    delete bill.billCalcRule;
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("bills", bill, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.dialogBill = null;
            this.fetchbills();
            this.showSnackbar("Bill created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        axios
          .put(`bills/${bill.id}`, bill, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.dialogBill = null;
            this.fetchbills();
            this.showSnackbar("Bill updated!");
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
      .delete(`bills/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Bill deleted.");
        this.fetchbills();
      });
  }

  mounted() {
    this.fetchbills();
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }
}
</script>
