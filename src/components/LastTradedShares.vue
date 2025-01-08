<template>
<q-page-container class="col-md-10 offset-md-1">
  <q-card flat bordered elevated class="q-pa-md">
    <q-card-section>
      <div class="text-h6 text-center">Last Traded Shares</div>
      <div class="text-subtitle2 text-center">
        A list of latest traded stock stored in the database
      </div>
    </q-card-section>
    <div>
      <q-table
        flat bordered
        :rows="rows"
        :columns="columns"
        row-key="name"
        :sort-method="customSort"
        binary-state-sort
      />
    </div>
  </q-card>
</q-page-container>
</template>
      
<script>
import httpUtils from 'src/assets/js/httpUtils';
import { defineComponent } from 'vue'
    
export default defineComponent({
    name: 'LastTradedShares',
    props: {},
    
    data() {
    return {
      rows: [],
      columns: []
    };
  },
  async created() {
    this.columns = [
    { name: 'Symbol', align: 'left', label: 'Symbol', field: 'symbol', sortable: true,  format: val => `${val}` },
    { name: 'Change', align: 'center', label: 'Change', field: 'change', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'Last Price', align: 'center', label: 'Last Price', field: 'last_price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'Avg. Price', align: 'center', label: 'Avg. Price', field: 'average_price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
  ]
    this.rows = await httpUtils.getLatestTradedStocks();
  }
});    
</script>
      