<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Bill
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" @keypress.enter="submit" action="">
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-select
              :items="billCalcRules"
              item-text="name"
              item-value="id"
              v-model="editBill.billCalcRuleId"
              label="Bill rule"
              prepend-icon="mdi-calculator"
              :rules="rules.required"
            >
            </v-select>
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editBill.value"
              label="Usage"
              prepend-icon="mdi-gauge"
              :rules="rules.required"
              type="number"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
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
                  :value="datepickerText"
                  label="Date range"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  :rules="rules.required"
                ></v-text-field>
              </template>
              <v-date-picker v-model="datepickerModel" range></v-date-picker>
            </v-menu>
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
import { Bill } from "../../store/modules/bill/types";
import { BillCalcRule } from "../../store/modules/billCalcRule/types";
@Component({
  name: "BillForm",
  props: {
    bill: Object as () => Bill | null,
    type: String
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  @Getter("user", { namespace: "user" }) loggedUser!: User;
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  editBill: Bill | null = null;
  billCalcRules: BillCalcRule[] = [];
  valid: boolean = false;
  datepicker: boolean = false;
  datepickerModel: string[] = [];
  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"]
  };

  get datepickerText() {
    if (this.editBill) {
      return [this.editBill.dateFrom, this.editBill.dateTo]
        .map(date => moment(date).format("YYYY-MM-DD"))
        .join(" - ");
    } else return "";
  }

  submit() {
    if (this.$refs.form) {
      (this.$refs.form as any).validate();
      if (this.valid) {
        this.$emit("submit", this.editBill);
      }
    }
  }

  @Watch("bill", { immediate: true })
  onBillChanged() {
    const billCalcRule = (this as any).bill.billCalcRule;
    this.editBill = {
      ...(this as any).bill,
      userId: this.loggedUser.id,
      user: this.loggedUser,
      billCalcRuleId: billCalcRule ? billCalcRule.id : undefined
    };
    if (this.editBill) {
      this.datepickerModel = [
        this.editBill.dateFrom,
        this.editBill.dateTo
      ].map(date => moment(date).format("YYYY-MM-DD"));
    }
  }

  @Watch("datepickerModel", { deep: true })
  datepickerModelChanged(value: string[]) {
    value = value.map(date => moment(date).toISOString());
    if (this.editBill) {
      this.editBill.dateFrom = value[0];
      this.editBill.dateTo = value[1];
    }
  }

  mounted() {
    this.fetchBillCalcRules();
  }

  fetchBillCalcRules() {
    axios
      .get("bill-calc-rules", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.billCalcRules = response.data;
      });
  }
}
</script>
