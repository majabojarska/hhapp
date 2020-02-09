<template>
  <v-list style="height:300px;overflow-y:scroll">
    <template v-for="(payment, n) in payments">
      <v-list-item :key="payment.user.id">
        <v-list-item-avatar :color="payment.user.color">
          <span :class="[TextService.textColorClass(payment.user.color)]">
            {{ UserService.getInitials(payment.user) }}
          </span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ payment.user.firstname }} {{ payment.user.surname }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="title">
          {{ payment.paymentTotal | price }}
        </v-list-item-action>
      </v-list-item>
      <v-divider :key="-payment.user.id" v-if="n != payments.length - 1" />
    </template>
  </v-list>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import { Payment } from "../../store/modules/dashboard/types";
import { Getter } from "vuex-class";
import TextService from "../../common/services/TextService";
import UserService from "../../store/modules/user/services/UserService";
import moment from "moment";
import { Watch } from "vue-property-decorator";
@Component({
  name: "PaymentsList",
  data: () => ({
    TextService,
    UserService
  }),

  filters: {
    price(price: number) {
      return Math.round(price * 100) / 100;
    }
  }
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  @Getter("horizon", { namespace: "dashboard" }) getHorizon!: [string, string];

  payments: Payment[] = [];

  async fetchList() {
    const response = await axios.get("/users/payments", {
      params: {
        dateFrom: this.getHorizon[0],
        dateTo: this.getHorizon[1]
      },
      headers: { Authorization: this.authHeader }
    });
    this.payments = response.data.payments;
  }
}
</script>
