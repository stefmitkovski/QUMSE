<template>
  <q-page-container>
    <q-card flat bordered elevated>
      <q-table
        :title="title"
        title-class="text-weight-medium text-subtitle1"
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="symbol"
        hide-bottom
      />
    </q-card>
  </q-page-container>
</template>


<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MostShares",
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
    flag: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  data() {
    return {
      columns: [
        {
          name: "symbol",
          label: this.$t("Symbol"),
          align: "center",
          field: "symbol",
          format: (val) => `${val}`,
        },
        {
          name: "change",
          label: this.$t("Change"),
          align: "center",
          field: "change",
          format: (val) => `${val}`,
        },
        {
          name: "last_price",
          label: this.$t("LastPrice"),
          align: "center",
          field: "last_price",
          format: (val) => `${val}`,
        },
      ],
    };
  },

  created() {
    if (this.flag) {
      const columnToUpdate = this.columns.find((col) => col.name === "change");
      if (columnToUpdate) {
        columnToUpdate.name = "quantity";
        columnToUpdate.label = this.$t("Quantity");
        columnToUpdate.field = "quantity";
      }
    }
  },
});
</script>
