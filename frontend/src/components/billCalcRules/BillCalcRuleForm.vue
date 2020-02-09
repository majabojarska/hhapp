<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Bill rule
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" @keypress.enter="submit" action="">
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editBillCalcRule.name"
              label="Name"
              prepend-icon="mdi-format-text"
              :rules="rules.required"
            >
            </v-text-field>
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editBillCalcRule.pricePerUnit"
              label="Price per unit"
              prepend-icon="mdi-cash"
              :rules="rules.required"
              type="number"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editBillCalcRule.unit"
              label="Unit"
              prepend-icon="mdi-android-studio"
              :rules="rules.required"
            ></v-text-field>
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
import { BillCalcRule } from "../../store/modules/billCalcRule/types";
import { log } from "util";
@Component({
  name: "BillCalcRuleForm",
  props: {
    billCalcRule: Object as () => BillCalcRule | null,
    type: String
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  editBillCalcRule: BillCalcRule | null = null;
  valid: boolean = false;

  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"]
  };

  submit() {
    if (this.$refs.form) {
      (this.$refs.form as any).validate();
      if (this.valid) {
        this.$emit("submit", this.editBillCalcRule);
      }
    }
  }

  @Watch("billCalcRule", { immediate: true })
  onRuleChanged() {
    this.editBillCalcRule = { ...(this as any).billCalcRule };
  }
}
</script>
