<script lang="ts">
import Vue from "vue";
import { Doughnut, mixins } from "vue-chartjs";
import Component from "vue-class-component";
import { ChartLineOptions, ChartData, ChartOptions } from "chart.js";
import { Watch } from "vue-property-decorator";
const { reactiveProp } = mixins;

@Component({
  name: "DoughnutChart",
  mixins: [reactiveProp],
  props: ["options"],
  extends: Doughnut
})
export default class extends Vue {
  chartData!: ChartData;
  options!: ChartOptions;
  renderChart!: any;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }

  @Watch("options", { deep: true })
  onOptionsChange(n: ChartOptions) {
    this.renderChart(this.chartData, this.options);
  }
}
</script>
