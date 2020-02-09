<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Expense
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" @keypress.enter="submit" action="">
        <v-row>
          <v-col :cols="12">
            <v-text-field
              v-model="editExpense.name"
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
              v-model="editExpense.price"
              label="Price"
              prepend-icon="mdi-currency-usd"
              :rules="rules.required"
            >
            </v-text-field>
          </v-col>
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
                  v-model="editExpense.date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  :rules="rules.required"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editExpense.date"
                @input="datepicker = false"
              ></v-date-picker>
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
import { Expense } from "../../store/modules/expense/types";
import { Getter } from "vuex-class";
import moment from "moment";
import { Watch } from "vue-property-decorator";
import { FormType } from "../../common/enums";
@Component({
  name: "ExpenseForm",
  props: {
    expense: Object as () => Expense | null,
    type: String
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  editExpense: Expense | null = null;
  valid: boolean = false;
  datepicker: boolean = false;

  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"]
  };

  submit() {
    if (this.$refs.form) {
      (this.$refs.form as any).validate();
      if (this.valid) {
        this.$emit("submit", this.editExpense);
      }
    }
  }

  @Watch("expense", { immediate: true })
  onRuleChanged() {
    this.editExpense = { ...(this as any).expense };
  }
}
</script>
