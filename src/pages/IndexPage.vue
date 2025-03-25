<template>
  <q-page>
  <MainTradedShares v-show="show" :show="show" @show="show = $event" />

  <div v-if="this.weekReport != false" class="row">
    <div class="col-md-10 offset-md-1">
      <div class="row justify-between q-gutter-md">
        <div class="col-12 col-md-3">
          <MostShares :rows="mostGainsReport" :title="this.$t('MostGains')" />
        </div>
        <div class="col-12 col-md-3">
          <MostShares :rows="mostLossesReport" :title="this.$t('MostLosses')" />
        </div>
        <div class="col-12 col-md-3">
          <MostShares
            :rows="mostQunatityReport"
            :flag="true"
            :title="this.$t('BiggestQuantity')"
          />
        </div>
      </div>
    </div>
  </div>

<div v-if="!show" 
       class="q-pa-none q-mb-none flex flex-center"
       :style="{'height': '100vh', 'background-color': $q.dark.isActive ? '#303030' : '#f5f5f5'}">
    <div class="text-center">
      <q-icon name="error" size="10em" :color="$q.dark.isActive ? 'white' : 'grey-5'" />
      <div class="q-mt-md text-h5" :class="{'text-grey-6': !$q.dark.isActive, 'text-white': $q.dark.isActive}">
        {{ $t('WrongIPAddress') }}
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
import Utils from "src/assets/js/Utils";

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
      show: false,
    };
  },

  async created() {
    console.log(this.show)
    if (Utils.hasValue(this.$q.sessionStorage.getItem("weekReport"))) {
      this.weekReport = JSON.parse(
        this.$q.sessionStorage.getItem("weekReport")
      );
    } else {
      this.$q.loading.show({
        message: this.$t('LoadingMsg'),
      });

      this.weekReport = await httpUtils.getWeeklyReport();
      this.$q.sessionStorage.setItem(
        "weekReport",
        JSON.stringify(this.weekReport)
      );

      this.$q.loading.hide();
    }
   
    if(this.weekReport){
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
    }
  },

});
</script>
