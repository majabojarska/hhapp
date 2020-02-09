<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="billCalcRules.length > 0">
      <v-list>
        <v-list-item
          v-for="rule in billCalcRules"
          :key="rule.id"
          @click.stop="edit(rule)"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ rule.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-icon small>mdi-calculator</v-icon>
              {{ `${rule.pricePerUnit} per ${rule.unit}` }}
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
                  @click.stop="option.action(rule.id)"
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
        <v-icon size="80">mdi-calculator</v-icon>
        List empty
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <bill-calc-rule-form
        :bill-calc-rule="dialogBillCalcRule"
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
import { BillCalcRule } from "../store/modules/billCalcRule/types";
import axios, { AxiosResponse } from "axios";
import { FormType } from "../common/enums";
import BillCalcRuleForm from "../components/billCalcRules/BillCalcRuleForm.vue";
@Component({
  name: "BillCalcRules",
  components: {
    BillCalcRuleForm
  }
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  billCalcRules: BillCalcRule[] = [];
  dialogBillCalcRule: BillCalcRule | null = null;
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

  fetchBillCalcRules() {
    axios
      .get("bill-calc-rules", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.billCalcRules = response.data;
      });
  }

  edit(billCalcRule: BillCalcRule) {
    this.formType = FormType.Edit;
    this.dialogBillCalcRule = { ...billCalcRule };
    this.dialogVisible = true;
  }

  create() {
    console.log(this.dialogVisible);

    this.formType = FormType.Create;
    this.dialogBillCalcRule = {
      name: "",
      pricePerUnit: 0,
      unit: ""
    };
    this.dialogVisible = true;
  }

  submit(billCalcRule: BillCalcRule) {
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("bill-calc-rules", billCalcRule, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchBillCalcRules();
            this.showSnackbar("Bill rule created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        axios
          .put(`bill-calc-rules/${billCalcRule.id}`, billCalcRule, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchBillCalcRules();
            this.showSnackbar("Bill rule updated!");
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
      .delete(`bill-calc-rules/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Bill rule deleted.");
        this.fetchBillCalcRules();
      })
      .catch(error => {
        if (error.response.status == 406) {
          this.showSnackbar(
            "Cannot delete bill rule! Other items depend on it."
          );
        }
      });
  }

  mounted() {
    this.fetchBillCalcRules();
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }
}
</script>
