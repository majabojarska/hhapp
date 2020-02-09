<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="expenses.length > 0">
      <v-list>
        <v-list-item
          v-for="expense in expenses"
          :key="expense.id"
          @click.stop="edit(expense)"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ expense.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text--primary">
              <v-icon small>mdi-calendar</v-icon>
              {{ expense.date | date }}
              <v-icon small class="ml-2">mdi-cash</v-icon>
              {{ `${expense.price} PLN` }}
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
                  @click.stop="option.action(expense.id)"
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
        <v-icon size="80">mdi-cash-multiple</v-icon>
        List empty
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <expense-form
        :expense="dialogExpense"
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
import Vue from "vue";
import Component from "vue-class-component";
import { Getter, Action } from "vuex-class";
import { Expense } from "../store/modules/expense/types";
import ExpenseForm from "../components/expenses/ExpenseForm.vue";
import TextService from "../common/services/TextService";
import axios, { AxiosResponse } from "axios";
import { FormType } from "../common/enums";
import moment from "moment";
@Component({
  name: "Expenses",
  components: { ExpenseForm },
  filters: {
    date(date: string) {
      return moment(date).format("YYYY-MM-DD");
    }
  },
  data: () => ({
    TextService
  })
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  expenses: Expense[] = [];
  dialogExpense: Expense | null = null;
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

  fetchExpenses() {
    axios
      .get("expenses", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.expenses = response.data;
      });
  }

  edit(expense: Expense) {
    this.formType = FormType.Edit;
    this.dialogExpense = { ...expense };
    this.dialogVisible = true;
  }

  create() {
    console.log(this.dialogVisible);

    this.formType = FormType.Create;
    this.dialogExpense = {
      name: "",
      price: 0,
      date: moment().format("YYYY-MM-DD")
    };
    this.dialogVisible = true;
  }

  submit(expense: Expense) {
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("expenses", expense, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchExpenses();
            this.showSnackbar("Expense created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        axios
          .put(`expenses/${expense.id}`, expense, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchExpenses();
            this.showSnackbar("Expense updated!");
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
      .delete(`expenses/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Expense deleted.");
        this.fetchExpenses();
      })
      .catch(error => {
        if (error.response.status == 406) {
          this.showSnackbar("Cannot delete expense! Other items depend on it.");
        }
      });
  }

  mounted() {
    this.fetchExpenses();
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }
}
</script>
