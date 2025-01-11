<template>
  <q-page-container class="col-md-10 offset-md-1">
    <q-card flat bordered elevated class="mobile-sticky-card">
      <div class="column q-pa-sm">
        <div class="row justify-center q-my-sm">
          <div class="cursor-pointer text-center">
            <b>Last Traded Shares</b> ({{ date }})
          </div>
        </div>

        <div class="row items-center ">
          <q-btn
            class="col-auto"
            flat
            color="primary"
            icon="fa-solid fa-list-check"
          />

          <div class="col">
            <q-input
              outlined
              dense
              v-model="searchReportString"
              placeholder="Search by symbol..."
              @update:model-value="searchReport"
              hide-underline
            >
              <template v-slot:append>
                <q-btn
                  v-if="searchReportString.length === 0"
                  flat
                  round
                  dense
                  color="primary"
                  icon="search"
                  @click="searchReport"
                />
                <q-btn
                  v-else
                  flat
                  round
                  dense
                  color="primary"
                  icon="close"
                  @click="clearSearch"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </q-card>
    <q-card flat bordered elevated class="q-pa-md">
      <q-virtual-scroll
        type="table"
        style="max-height: 70vh"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="rows"
      >
        <template v-slot:before>
          <thead class="thead-sticky sticky">
            <tr>
              <th v-for="col in columns" :key="col.name">
                {{ col.name }}
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot="{ item }">
          <tr>
            <td class="text-center">{{ item.symbol }}</td>
            <td class="text-center">
              {{ isNaN(item.average_price) ? 0 : item.average_price }}
            </td>
            <td class="text-center">
              {{ isNaN(item.change) ? 0 : item.change }}
            </td>
            <td class="text-center">
              {{ isNaN(item.last_price) ? 0 : item.last_price }}
            </td>
            <td class="text-center">{{ isNaN(item.max) ? 0 : item.max }}</td>
            <td class="text-center">{{ isNaN(item.min) ? 0 : item.min }}</td>
            <td class="text-center">
              {{ isNaN(item.purchase_price) ? 0 : item.purchase_price }}
            </td>
            <td class="text-center">
              {{ isNaN(item.quantity) ? 0 : item.quantity }}
            </td>
            <td class="text-center">
              {{ isNaN(item.sale_price) ? 0 : item.sale_price }}
            </td>
            <td class="text-center">
              {{
                isNaN(item.turnover_in_1000_den) ? 0 : item.turnover_in_1000_den
              }}
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </q-card>
  </q-page-container>
</template>

<script>
import httpUtils from "src/assets/js/httpUtils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LastTradedShares",
  props: {},

  data() {
    return {
      rows: [],
      backupRows: [],
      columns: [],
      date: Date.now,
      searchReportString: "",
    };
  },
  async created() {
    this.columns = [
      {
        name: "Symbol",
        field: "symbol",
      },
      {
        name: "Avg. Price",
        field: "average_price",
      },
      {
        name: "Change",
        field: "change",
      },
      {
        name: "Last Price",
        field: "last_price",
      },
      {
        name: "Max",
        field: "max",
      },
      {
        name: "Min",
        field: "min",
      },
      {
        name: "Purchase Price",
        field: "purchase_price",
      },
      {
        name: "Quantity",
        field: "quantity",
      },
      {
        name: "Sale Price",
        field: "sale_price",
      },
      {
        name: "Turnover In 1000 den",
        field: "turnover_in_1000_den",
      },
    ];
    this.rows = await httpUtils.getLatestTradedStocks();
    this.backupRows = this.rows;
    this.date = this.rows[0].date["$date"].substring(0, 10);
  },

  methods: {
    searchReport() {
      if (this.searchReportString.length === 0) {
        this.rows = [...this.backupRows];
      } else {
        this.rows = this.backupRows.filter((item) =>
          item.symbol
            .toLowerCase()
            .includes(this.searchReportString.toLowerCase())
        );
      }
    },

    clearSearch() {
      this.searchReportString = "";
      this.searchReport();
    },
  },
});
</script>
<style>
.thead-sticky tr > * {
  position: sticky;
  opacity: 1;
  z-index: 1;
  background: white;
}

.thead-sticky tr:last-child > * {
  top: 0;
}
.mobile-sticky-card {
  max-width: 100vw;
  position: -webkit-sticky;
  position: sticky;
  top: 0;  
  left: 0;
  /* z-index: 10; */
  overflow-x: auto;
}
</style>
