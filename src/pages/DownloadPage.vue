<template>
  <div v-if="this.companies != false" class="row">
    <q-page-container class="col-12 col-md-10 offset-md-1">
      <q-card
  flat
  bordered
  elevated
  class="mobile-sticky-card"
  :class="{ 'bg-dark text-white': $q.dark.isActive }"
>
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
        :label="this.$t('SearchCompany')"
        :options="options"
        @filter="filter"
        style="width: 100%"
        :class="{ 'bg-dark text-white': $q.dark.isActive }"
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
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="date" mask="YYYY/MM/DD" range>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="this.$t('Close')" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </template>

        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">No results found</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div v-for="(item, index) in model" :key="index">
      <q-separator spaced />

      <q-item clickable :class="{ 'bg-dark text-white': $q.dark.isActive }">
        <q-item-section avatar>
          <q-checkbox keep-color v-model="selected" color="primary" :val="item.value" />
        </q-item-section>

        <q-item-section @click="toggleCheckbox(item.value)">
          {{ item.label }}
        </q-item-section>

        <q-item-section side>
          <q-btn flat round icon="close" color="primary" @click="removeSelected(item)" />
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
          :label="this.$t('Download')"
        />
      </div>
    </q-page-container>
  </div>
  <div v-else 
       class="q-pa-none q-mb-none flex flex-center"
       :style="{'height': '100vh', 'background-color': $q.dark.isActive ? '#303030' : '#f5f5f5'}">
    <div class="text-center">
      <q-icon name="error" size="10em" :color="$q.dark.isActive ? 'white' : 'grey-5'" />
      <div class="q-mt-md text-h5" :class="{'text-grey-6': !$q.dark.isActive, 'text-white': $q.dark.isActive}">
        {{ $t('WrongIPAddress') }}
      </div>
    </div>
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
          name: this.$t("Symbol"),
          label: this.$t("Symbol"),
          field: "symbol",
          value: true,
        },
        {
          name: this.$t("AvgPrice"),
          label: this.$t("AvgPrice"),
          field: "average_price",
          value: true,
        },
        {
          name: this.$t("Change"),
          label: this.$t("Change"),
          field: "change",
          value: true,
        },
        {
          name: this.$t("LastPrice"),
          label: this.$t("LastPrice"),
          field: "last_price",
          value: true,
        },
        {
          name: this.$t("Max"),
          label: this.$t("Max"),
          field: "max",
          value: true,
        },
        {
          name: this.$t("Min"),
          label: this.$t("Min"),
          field: "min",
          value: true,
        },
        {
          name: this.$t("PurchasePrice"),
          label: this.$t("PurchasePrice"),
          field: "purchase_price",
          value: true,
        },
        {
          name: this.$t("Quantity"),
          label: this.$t("Quantity"),
          field: "quantity",
          value: true,
        },
        {
          name: this.$t("SalePrice"),
          label: this.$t("SalePrice"),
          field: "sale_price",
          value: true,
        },
        {
          name: this.$t("TurnoverIn1000den"),
          label: this.$t("TurnoverIn1000den"),
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
        message: this.$t("LoadingMsg"),
      });

      if (!this.date.from || !this.date.to) {
        this.$q.notify({
          type: "negative",
          message: this.$t("ForgotDate"),
        });
        this.$q.loading.hide();
        return;
      }

      if (this.selectedFields.length === 0) {
        this.$q.notify({
          type: "negative",
          message: this.$t("ForgotToSelectAField"),
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
            message: this.$t("NoDataAvailable"),
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
          this.$t("Date"),
          ...companies.flatMap((company) =>
            this.selectedFields
              .map((field) => {
                const column = this.columns.find((col) => col.field === field);
                return column ? `${company} ${column.name}` : null;
              })
              .filter((item) => item !== null)
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
        XLSX.utils.book_append_sheet(wb, ws, this.$t("StockData"));

        XLSX.writeFile(wb, this.$t("StockData") + ".xlsx");
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: this.$t("ErrorGettingData") + error.message,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
});
</script>
<style>
.mobile-sticky-card {
  max-width: 100vw;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
  overflow-x: auto;
}
.q-page-container {
  padding-top: 55px !important;
}
</style>