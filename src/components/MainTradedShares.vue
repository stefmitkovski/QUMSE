<template>
<div class="row">
  <q-page-container class="col-md-10 offset-md-1">
    <q-card flat bordered elevated class="mobile-sticky-card">
      <div class="column q-pa-sm">
        <div class="row justify-center q-my-sm">
          <div class="text-center">
            <b>Shares Traded on </b> ({{ date }})
            <q-btn icon="event" flat dense color="primary">
              <q-popup-proxy
                @before-show="updateDate"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="currentReportDate"
                  :options="this.available_reports"
                >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      dense
                      @click="chosenReportDate"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </div>
        </div>

        <div class="row items-center">
          <q-btn
            class="col-auto"
            flat
            color="primary"
            icon="fa-solid fa-list-check"
            @click="selectFields"
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
        style="max-height: 50vh"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="rows"
      >
        <template v-slot:before>
          <thead class="thead-sticky sticky">
            <tr>
              <th
                v-for="col in columns.filter((column) =>
                  this.selectedFields.includes(column.field)
                )"
                :key="col.name"
              >
                {{ col.name }}
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot="{ item }">
          <tr>
            <td class="text-center">{{ item.symbol }}</td>
            <td
              v-show="selectedFields.includes('average_price')"
              class="text-center"
            >
              {{ isNaN(item.average_price) ? 0 : item.average_price }}
            </td>
            <td v-show="selectedFields.includes('change')" class="text-center">
              {{ isNaN(item.change) ? 0 : item.change }}
            </td>
            <td
            v-show="selectedFields.includes('last_price')"
            class="text-center"
            >
              {{ isNaN(item.last_price) ? 0 : item.last_price }}
            </td>
            <td v-show="selectedFields.includes('max')" class="text-center">
              {{ isNaN(item.max) ? 0 : item.max }}
            </td>
            <td v-show="selectedFields.includes('min')" class="text-center">
              {{ isNaN(item.min) ? 0 : item.min }}
            </td>
            <td
              v-show="selectedFields.includes('purchase_price')"
              class="text-center"
            >
              {{ isNaN(item.purchase_price) ? 0 : item.purchase_price }}
            </td>
            <td
              v-show="selectedFields.includes('quantity')"
              class="text-center"
            >
              {{ isNaN(item.quantity) ? 0 : item.quantity }}
            </td>
            <td
              v-show="selectedFields.includes('sale_price')"
              class="text-center"
            >
              {{ isNaN(item.sale_price) ? 0 : item.sale_price }}
            </td>
            <td
              v-show="selectedFields.includes('turnover_in_1000_den')"
              class="text-center"
            >
              {{
                isNaN(item.turnover_in_1000_den) ? 0 : item.turnover_in_1000_den
              }}
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </q-card>
  </q-page-container>
</div>
</template>

<script>
import httpUtils from "src/assets/js/httpUtils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainTradedShares",
  props: {},

  data() {
    return {
      rows: [],
      backupRows: [],
      columns: [],
      date: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
      currentReportDate: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
      searchReportString: "",
      selectedFields: [],
      available_reports: [],
    };
  },
  async created() {
    this.columns = [
      {
        name: "Sybmol",
        label: "Symbol",
        field: "symbol",
        value: true,
      },
      {
        name: "Avg. Price",
        label: "Avg. Price",
        field: "average_price",
        value: true,
      },
      {
        name: "Change",
        label: "Change",
        field: "change",
        value: true,
      },
      {
        name: "Last Price",
        label: "Last Price",
        field: "last_price",
        value: true,
      },
      {
        name: "Max",
        label: "Max",
        field: "max",
        value: true,
      },
      {
        name: "Min",
        label: "Min",
        field: "min",
        value: true,
      },
      {
        name: "Purchase Price",
        label: "Purchase Price",
        field: "purchase_price",
        value: true,
      },
      {
        name: "Quantity",
        label: "Quantity",
        field: "quantity",
        value: true,
      },
      {
        name: "Sale Price",
        label: "Sale Price",
        field: "sale_price",
        value: true,
      },
      {
        name: "Turnover In 1000 den",
        label: "Turnover In 1000 den",
        field: "turnover_in_1000_den",
        value: true,
      },
    ];
    this.$q.loading.show({
      message: "Getting data. Hang on...",
    });
    this.rows = await httpUtils.getLatestTradedStocks();
    this.backupRows = this.rows;
    this.date = this.rows[0].date["$date"].substring(0, 10).replace(/-/g, "/");

    if (this.$q.sessionStorage.getItem("selectedFields")) {
      this.selectedFields = JSON.parse(
        this.$q.sessionStorage.getItem("selectedFields")
      );
    } else {
      this.selectedFields = this.columns
        .map((item) => (item.value ? item.field : null))
        .filter((field) => field !== null);

      this.$q.sessionStorage.setItem(
        "selectedFields",
        JSON.stringify(this.selectedFields)
      );
    }

    if (this.$q.sessionStorage.getItem("available_reports")) {
      this.available_reports = JSON.parse(
        this.$q.sessionStorage.getItem("available_reports")
      );
    } else {
      this.available_reports = await httpUtils.getAllAvailableReports();

      this.$q.sessionStorage.setItem(
        "available_reports",
        JSON.stringify(this.available_reports)
      );
    }
    this.$q.loading.hide();
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

    selectFields() {
      this.$q
        .dialog({
          title: "Select fields",
          message: "Choose what fields you like to see:",
          options: {
            type: "checkbox",
            // inline: true
            model: this.selectedFields,
            items: this.columns.slice(1).map((item) => ({
              label: item.label,
              value: item.field,
            })),
          },
          cancel: true,
          persistent: false,
        })
        .onOk((data) => {
          this.selectedFields = data;
          this.$q.sessionStorage.setItem("selectedFields",JSON.stringify(this.selectedFields))

          this.columns.forEach(function (el) {
            if (!(el.value in data)) {
              el.value = false;
            }
          });
          // console.log(">>>> OK, received", data);
        })
        .onCancel(() => {
          // console.log(">>>> Cancel");
        })
        .onDismiss(() => {
          // console.log("I am triggered on both OK and Cancel");
        });
    },

    updateDate() {
      this.currentReportDate = this.date;
    },

    async chosenReportDate() {
      this.$q.loading.show({
        message: "Getting data. Hang on...",
      });

      const rows = await httpUtils.getSpecificReport(this.currentReportDate);
      this.rows = rows;
      this.date = this.currentReportDate;
      this.$q.loading.hide()
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
