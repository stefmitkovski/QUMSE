<template>
  <q-page>
    <MainTradedShares />
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <div class="row justify-between q-gutter-md">
          <div class="col-12 col-md-3">
            <MostShares :rows="mostGainsReport" :title="'Most Gains'" />
          </div>
          <div class="col-12 col-md-3">
            <MostShares :rows="mostLossesReport" :title="'Most Losses'" />
          </div>
          <div class="col-12 col-md-3">
            <MostShares
              :rows="mostQunatityReport"
              :flag="true"
              :title="'Most Quantity'"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import MostShares from "src/components/MostShares.vue";
import httpUtils from "src/assets/js/httpUtils";
import MainTradedShares from "src/components/MainTradedShares.vue";

export default defineComponent({
  name: "IndexPage",

  components: {
    MostShares,
    MainTradedShares
  },

  data() {
    return {
      weekReport: [],
      mostGainsReport: [],
      mostQunatityReport: [],
      mostLossesReport: [],
    };
  },

  async created() {
    if (this.$q.sessionStorage.getItem("weekReport")) {
      this.weekReport = JSON.parse(
        this.$q.sessionStorage.getItem("weekReport")
      );
    } else {
      this.$q.loading.show({
        message: "Getting weekly data. Hang on...",
      });

      this.weekReport = await httpUtils.getWeeklyReport();

      this.$q.sessionStorage.setItem(
        "weekReport",
        JSON.stringify(this.weekReport)
      );
      this.$q.loading.hide();
    }
    
    this.mostGainsReport = this.weekReport
      .map((row) => ({
        ...row,
        change: parseFloat(row.change.toFixed(2)),
      }))
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);

    this.mostQunatityReport = this.weekReport
      .map((row) => ({
        ...row,
        quantity: parseFloat(row.quantity.toFixed(2)),
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    this.mostLossesReport = this.weekReport
      .map((row) => ({
        ...row,
        change: parseFloat(row.change.toFixed(2)),
      }))
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);

  },
});
</script>
