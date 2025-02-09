<template>
  <div class="row">
    <q-page-container class="col-12 col-md-10 offset-md-1">
      <q-card flat bordered elevated class="mobile-sticky-card">
        <div class="column q-pa-sm">
          <div class="row justify-center">
            <q-select
              outlined
              clearable
              v-model="model"
              fill-input
              use-input
              input-debounce="0"
              multiple
              hide-selected
              label="Search for a company"
              :options="options"
              @filter="filter"
              style="width: 100%"
            >
              <template v-slot:before>
                <q-btn
                  class="col-auto"
                  flat
                  color="primary"
                  icon="fa-solid fa-list-check"
                  @click="selectFields"
                />
              </template>

              <template v-slot:after>
                <q-btn icon="event" flat dense color="primary">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="date" mask="YYYY/MM/DD" range>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results found
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div v-for="(item, index) in model" :key="index">
            <q-separator spaced />

            <q-item clickable>
              <q-item-section avatar>
                <q-checkbox
                  keep-color
                  v-model="selected"
                  color="primary"
                  :val="item.value"
                />
              </q-item-section>

              <q-item-section @click="toggleCheckbox(item.value)">
                {{ item.label }}
              </q-item-section>

              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="close"
                  color="primary"
                  @click="removeSelected(item)"
                />
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card>
      <div
        v-if="this.model.length > 0"
        class="row items-center justify-center q-py-md"
      >
        <q-btn
          :disable="selected.length === 0"
          @click="downloadData"
          color="primary"
          label="Download"
        />
      </div>
    </q-page-container>
  </div>
</template>

<script>
import cyrillicToLatin from "cyrillic-romanization";
import httpUtils from "src/assets/js/httpUtils";
import Utils from "src/assets/js/Utils";
import { defineComponent } from "vue";
import * as XLSX from "xlsx";
export default defineComponent({
  name: "DownloadPage",

  data() {
    return {
      companies: [], // Site kompanii
      selected: [], // Slektiranite kompanii
      options: [], // Kompaniite koi se pojavuvaat pri prebaruvanje
      model: [],
      date: { from: "", to: "" },
      selectedFields: [],
      columns: [
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
      ],
    };
  },
  async created() {
    if (this.$q.sessionStorage.getItem("companies")) {
      this.companies = JSON.parse(this.$q.sessionStorage.getItem("companies"));
    } else {
      this.companies = await httpUtils.getListCompanies();
      if (this.companies != false) {
        this.$q.sessionStorage.setItem(
          "companies",
          JSON.stringify(this.companies)
        );
      }
    }
  },

  methods: {
    filter(val, update) {
      if (val === "") {
        update(() => {
          this.options = [...this.companies];
        });
        return;
      }

      update(() => {
        const input = val.toLowerCase();

        this.options = this.companies.filter(
          (company) =>
            company.label.toLowerCase().includes(input) ||
            cyrillicToLatin(company.label.toLowerCase(), "mkd").includes(input)
        );
      });
    },

    toggleCheckbox(val) {
      const index = this.selected.indexOf(val);
      if (index !== -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(val);
      }
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
          this.$q.sessionStorage.setItem(
            "selectedFields",
            JSON.stringify(this.selectedFields)
          );

          this.columns.forEach(function (el) {
            if (!(el.value in data)) {
              el.value = false;
            }
          });
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    },

    removeSelected(val) {
      const modelIndex = this.model.findIndex(
        (item) => item.value === val.value
      );
      if (modelIndex !== -1) {
        this.model.splice(modelIndex, 1);
      }

      const selectedIndex = this.selected.indexOf(val.value);
      if (selectedIndex !== -1) {
        this.selected.splice(selectedIndex, 1);
      }
    },

    async downloadData() {
      this.$q.loading.show({
        message: "Getting data. Hang on...",
      });

      if (!this.date.from || !this.date.to) {
        this.$q.notify({
          type: "negative",
          message: "Forgot to set a date",
        });
        this.$q.loading.hide();
        return;
      }

      if (this.selectedFields.length === 0) {
        this.$q.notify({
          type: "negative",
          message: "No field is selected",
        });
        this.$q.loading.hide();
        return;
      }

      try {
        const data = await httpUtils.getDataForComapnies(
          [...this.selected],
          this.date.from,
          this.date.to
        );

        if (!data || data.length === 0) {
          this.$q.notify({
            type: "negative",
            message: "No data available for the selected range.",
          });
          this.$q.loading.hide();
          return;
        }

        const transformedData = Utils.transformDataForDownload(
          this.selectedFields,
          data
        );
        const { dates, companies } = transformedData;

        // Prviot red
        const headerRow = [
          "Date",
          ...companies.flatMap((company) =>
            this.selectedFields.map((field) => `${company} ${field}`)
          ),
        ];

        const worksheetData = [headerRow];

        dates.forEach((date, index) => {
          const row = [date];

          companies.forEach((company, compIndex) => {
            this.selectedFields.forEach((field) => {
              row.push(
                transformedData[field] && transformedData[field][compIndex]
                  ? (transformedData[field][compIndex][index] ?? "")
                  : ""
              );
            });
          });

          worksheetData.push(row);
        });

        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stock Data");

        XLSX.writeFile(wb, "StockData.xlsx");
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: "Error downloading data: " + error.message,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
});
</script>
