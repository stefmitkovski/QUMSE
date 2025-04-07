<template>
  <div
    :class="{
      'row': !$q.platform.is.mobile,
      'q-pa-none': $q.platform.is.mobile,
    }"
  >
    <q-page-container
      :class="{
        'col-md-10 offset-md-1': !$q.platform.is.mobile,
        'col-12 q-pa-none': $q.platform.is.mobile,
      }"
    >
      <q-card
        flat
        bordered
        elevated
        class="mobile-sticky-card"
        :class="{ 'bg-dark text-white': $q.dark.isActive }"
      >
        <div class="column q-pa-sm">
          <div class="row justify-center q-my-sm">
            <div class="text-center">
              <q-btn
                @click="changeLiveMode"
                icon="radio_button_checked"
                flat
                dense
                color="primary"
              />
              <b v-show="!this.liveMode" class="q-px-sm text-subtitle1"
                >{{ $t("TradedOn") }} ({{ date }})</b
              >
              <b v-show="this.liveMode" class="q-px-sm text-subtitle1">
                {{ $t("LiveTracking") }}</b
              >

              <q-btn
                v-show="this.liveMode"
                @click="getLatestLiveInformation"
                icon="refresh"
                flat
                dense
                color="primary"
              />

              <p v-show="this.liveMode" class="text-subtitle2 text-grey-14">
                {{ $t("LastUpdated") }}({{ this.lastLiveTimestamp }})
              </p>
              <q-btn
                v-show="!this.liveMode"
                icon="event"
                flat
                dense
                color="primary"
              >
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
                      <q-btn
                        :label="this.$t('Cancel')"
                        color="primary"
                        flat
                        v-close-popup
                      />
                      <q-btn
                        :label="this.$t('OK')"
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
              v-show="!this.liveMode"
            />

            <div class="col">
              <q-input
                outlined
                dense
                v-model="searchReportString"
                :placeholder="$t('SearchCompany')"
                @update:model-value="searchReport"
                hide-underline
                :class="{ 'bg-dark text-white': $q.dark.isActive }"
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
            <thead
              :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light'"
            >
              <tr>
                <th
                  v-for="col in columns.filter((column) =>
                    selectedFields.includes(column.field)
                  )"
                  :key="col.field"
                >
                  <b>{{ $t(col.label) }}</b>
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot="{ item }">
            <tr>
              <td class="text-center">
                <q-tooltip
                  v-if="!this.liveMode"
                  anchor="top middle"
                  self="bottom middle"
                >
                  {{ item.name }}
                </q-tooltip>
                {{ item.symbol }}
              </td>
              <td
                v-show="selectedFields.includes('average_price')"
                class="text-center"
              >
                {{ isNaN(item.average_price) ? 0 : item.average_price }}
              </td>
              <td
                v-show="selectedFields.includes('change')"
                class="text-center"
              >
                {{
                  liveMode ? item.change : isNaN(item.change) ? 0 : item.change
                }}
              </td>
              <td
                v-show="selectedFields.includes('last_price')"
                class="text-center"
              >
                {{
                  liveMode
                    ? item.last_price
                    : isNaN(item.last_price)
                      ? 0
                      : item.last_price
                }}
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
                  isNaN(item.turnover_in_1000_den)
                    ? 0
                    : item.turnover_in_1000_den
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
import cyrillicToLatin from "cyrillic-romanization";
import httpUtils from "src/assets/js/httpUtils";
import Utils from "src/assets/js/Utils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainTradedShares",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    liveMode() {
      this.getData();
    },
  },

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
      liveMode: true,
      lastLiveTimestamp: "",
      interval: null
    };
  },

  async created() {
    this.getTime();
    this.getData();
  },

  mounted(){
    this.intervalId = setInterval(() => {
      this.getTime();
      this.getData();
    }, 1 * 60 * 1000);
  },

  beforeUnmount(){
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  async changeLiveMode() {
    this.liveMode = !this.liveMode;
    this.$q.sessionStorage.setItem("liveMode", this.liveMode.toString());
    await this.getData();
  },

  unmounted() {
    this.$q.sessionStorage.setItem("liveMode", this.liveMode.toString());
  },

  methods: {
    async getData() {
      this.$q.loading.show({ message: this.$t("LoadingMsg") });

      if (Utils.hasValue(this.$q.sessionStorage.getItem("liveMode")))
        this.liveMode = this.$q.sessionStorage.getItem("liveMode") === "true";

      this.columns = this.liveMode
        ? [
            { name: this.$t("Symbol"), label: "Symbol", field: "symbol" },
            { name: this.$t("Change"), label: "Change", field: "change" },
            {
              name: this.$t("LastPrice"),
              label: "LastPrice",
              field: "last_price",
            },
          ]
        : [
            { name: this.$t("Symbol"), label: "Symbol", field: "symbol" },
            {
              name: this.$t("AvgPrice"),
              label: "AvgPrice",
              field: "average_price",
            },
            { name: this.$t("Change"), label: "Change", field: "change" },
            {
              name: this.$t("LastPrice"),
              label: "LastPrice",
              field: "last_price",
            },
            { name: this.$t("Max"), label: "Max", field: "max" },
            { name: this.$t("Min"), label: "Min", field: "min" },
            {
              name: this.$t("PurchasePrice"),
              label: "PurchasePrice",
              field: "purchase_price",
            },
            { name: this.$t("Quantity"), label: "Quantity", field: "quantity" },
            {
              name: this.$t("SalePrice"),
              label: "SalePrice",
              field: "sale_price",
            },
            {
              name: this.$t("TurnoverIn1000den"),
              label: "TurnoverIn1000den",
              field: "turnover_in_1000_den",
            },
          ];

      this.rows = this.liveMode
        ? await httpUtils.getLiveInformations()
        : await httpUtils.getLatestTradedStocksReport();

      if (this.rows && this.rows.length) {
        this.backupRows = [...this.rows];

        if (!this.liveMode) {
          this.date =
            this.rows[0]?.date?.["$date"]
              ?.substring(0, 10)
              .replace(/-/g, "/") || "";
          this.available_reports = this.$q.sessionStorage.getItem(
            "available_reports"
          )
            ? JSON.parse(this.$q.sessionStorage.getItem("available_reports"))
            : await httpUtils.getAllAvailableReports();
          this.$q.sessionStorage.setItem(
            "available_reports",
            JSON.stringify(this.available_reports)
          );
          this.selectedFields = this.$q.sessionStorage.getItem("selectedFields")
            ? JSON.parse(this.$q.sessionStorage.getItem("selectedFields"))
            : this.columns.map((item) => item.field);

          this.$q.sessionStorage.setItem(
            "selectedFields",
            JSON.stringify(this.selectedFields)
          );
        } else {
          this.selectedFields = ["symbol", "change", "last_price"];
        }

        this.$emit("show", true);
      } else {
        this.$emit("show", false);
      }

      this.$q.loading.hide();
    },

    getTime() {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = now.getFullYear();

      this.lastLiveTimestamp = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

      this.lastLiveTimestamp;
    },

    searchReport() {
      if (this.searchReportString.length === 0) {
        this.rows = [...this.backupRows];
      } else {
        this.rows = this.backupRows.filter((item) => {
          const searchLower = this.searchReportString.toLowerCase();
          return this.liveMode
            ? item.symbol.toLowerCase().includes(searchLower)
            : item.symbol.toLowerCase().includes(searchLower) ||
                cyrillicToLatin(item.name.toLowerCase(), "mkd").includes(
                  searchLower
                ) ||
                item.name.toLowerCase().includes(searchLower);
        });
      }
    },

    clearSearch() {
      this.searchReportString = "";
      this.searchReport();
    },

    selectFields() {
      this.$q
        .dialog({
          title: this.$t("SelectFields"),
          message: this.$t("SelectFieldsLongMsg"),
          options: {
            type: "checkbox",
            model: this.selectedFields,
            items: this.columns.slice(1).map((item) => ({
              label: item.label,
              value: item.field,
            })),
          },
          cancel: this.$t("Cancel"),
          persistent: false,
          ok: this.$t("OK"),
        })
        .onOk((data) => {
          this.selectedFields = data;
          this.$q.sessionStorage.setItem(
            "selectedFields",
            JSON.stringify(this.selectedFields)
          );

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

    getLatestLiveInformation() {
      this.getTime();
      this.getData();
    },

    changeLiveMode() {
      this.liveMode = !this.liveMode;
      this.getData();
      this.created();
    },

    async chosenReportDate() {
      this.$q.loading.show({
        message: this.$t("LoadingMsg"),
      });

      const rows = await httpUtils.getSpecificReport(this.currentReportDate);
      this.rows = rows;
      this.date = this.currentReportDate;
      this.$q.loading.hide();
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
.q-page-container {
  padding-top: 45px !important;
}
</style>
