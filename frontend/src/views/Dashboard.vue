<template>
  <div>
    <v-toolbar>
      <v-menu
        v-model="datepickerVisible"
        :close-on-content-click="false"
        transition="scale-transition"
        origin="top left"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon text v-on="on">
            <v-icon>mdi-calendar</v-icon>
          </v-btn>
        </template>
        <v-date-picker
          @change="
            fetchStats();
            datepickerVisible = false;
          "
          v-model="horizon"
          range
        ></v-date-picker>
      </v-menu>
      <v-toolbar-title>
        {{ horizon[0] || "YYYY-MM-DD" }} -
        {{ horizon[1] || "YYYY-MM-DD" }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        :color="sharedOnly ? 'primary' : 'default'"
        icon
        text
        title="Only shared"
        :dark="sharedOnly"
        @click="
          () => {
            sharedOnly = !sharedOnly;
            fetchStats();
          }
        "
      >
        <v-icon>mdi-account-switch</v-icon>
      </v-btn>
      <v-btn
        :color="stacked ? 'primary' : 'default'"
        icon
        text
        title="Stacked"
        :dark="stacked"
        @click="stacked = !stacked"
      >
        <v-icon>mdi-chart-bar-stacked</v-icon>
      </v-btn>
      <v-btn color="primary" icon text :dark="sharedOnly" @click="fetchStats()">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
      <v-row>
        <v-col :cols="12" :md="6">
          <v-card>
            <v-card-title>Purchases in time</v-card-title>
            <v-card-text>
              <line-chart
                :height="300"
                :chart-data="purchasesInTimeData"
                :options="chartOptions"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="12" :md="6">
          <v-card>
            <v-card-title>Purchases by category</v-card-title>
            <v-card-text>
              <bar-chart
                :height="300"
                :chart-data="purchasesByCategoryData"
                :options="chartOptions"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12" :md="6">
          <v-card>
            <v-card-title>Purchases by category</v-card-title>
            <v-card-text>
              <doughnut-chart
                :height="300"
                :chart-data="purchasesByCategoryDoughnutData"
                :options="chartOptionsNoScales"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="12" :md="6">
          <v-card>
            <v-card-title>Payments</v-card-title>
            <v-card-text>
              <payments-list ref="payments" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";
import Component from "vue-class-component";
import { Action, Getter, Mutation } from "vuex-class";
import LineChart from "../components/charts/LineChart.vue";
import BarChart from "../components/charts/BarChart.vue";
import DoughnutChart from "../components/charts/DoughnutChart.vue";
import PaymentsList from "../components/dashboard/PaymentsList.vue";
import _ from "lodash";
import {
  ChartDataSets,
  ChartData,
  ChartLineOptions,
  ChartOptions
} from "chart.js";
import moment from "moment";
import axios from "axios";
import { getters } from "../store/modules/user/getters";
@Component({
  name: "Home",
  components: { LineChart, BarChart, DoughnutChart, PaymentsList }
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  datepickerVisible: boolean = false;
  stacked: boolean = false;
  @Getter("horizon", { namespace: "dashboard" }) getHorizon!: [string, string];
  @Mutation("setHorizon", { namespace: "dashboard" }) setHorizon!: (
    payload: [string, string]
  ) => void;
  get horizon() {
    return this.getHorizon;
  }
  set horizon(value: [string, string]) {
    this.setHorizon(value);
  }

  @Getter("sharedOnly", { namespace: "dashboard" }) getSharedOnly!: boolean;
  @Mutation("setSharedOnly", { namespace: "dashboard" }) setSharedOnly!: (
    payload: boolean
  ) => void;
  get sharedOnly() {
    return this.getSharedOnly;
  }
  set sharedOnly(value: boolean) {
    this.setSharedOnly(value);
  }

  purchasesInTimeData: ChartData = {
    labels: [],
    datasets: []
  };

  purchasesByCategoryData: ChartData = {
    labels: [],
    datasets: []
  };

  purchasesByCategoryDoughnutData: ChartData = {
    labels: [],
    datasets: []
  };

  mounted() {
    this.fetchStats();
  }

  get chartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{ ticks: { beginAtZero: true }, stacked: this.stacked }],
        xAxes: [{ stacked: this.stacked }]
      }
    };
  }

  get chartOptionsNoScales(): ChartOptions {
    const options = _.cloneDeep(this.chartOptions);
    options.scales = {};
    return options;
  }

  async fetchStats() {
    const url = `/stats?dateFrom=${this.horizon[0]}&dateTo=?${this.horizon[1]}&sharedOnly=${this.sharedOnly}`;
    const response = await axios.get("stats", {
      params: {
        dateFrom: this.horizon[0],
        dateTo: this.horizon[1],
        sharedOnly: this.sharedOnly
      },
      headers: { Authorization: this.authHeader }
    });

    this.purchasesInTimeData = response.data.purchasesInTime;
    this.purchasesByCategoryData = response.data.purchasesByCategory;
    this.purchasesByCategoryDoughnutData =
      response.data.purchasesByCategoryDoughnut;

    (this.$refs["payments"] as any).fetchList();
  }
}
</script>
