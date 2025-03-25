<template>
  <q-page-container class="scroll-container">
    <q-card flat bordered elevated class="mobile-sticky-card">
      <q-table
        :title="title"
        title-class="text-weight-medium text-subtitle1 text-center"
        flat
        bordered
        :rows="rows"
        :columns="computedColumns"
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

  computed: {
    computedColumns() {
      const baseColumns = [
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
      ];

      if (this.flag) {
        const updatedColumns = baseColumns.map((col) => {
          if (col.name === "change") {
            return {
              ...col,
              name: "quantity",
              label: this.$t("Quantity"),
              field: "quantity",
            };
          }
          return col;
        });
        return updatedColumns;
      }

      return baseColumns;
    },
  },
});
</script>

<style>
.scroll-container {
  overflow-x: auto; /* Allow horizontal scrolling */
  position: relative;
}

.mobile-sticky-card {
  position: sticky; /* Stick the card to the top */
  top: 0; /* Align to the top */
  left: 0;
  z-index: 10; /* Ensure the sticky card is above other content */
  background-color: white; /* Prevent transparency issues */
  width: 100%; /* Ensure the sticky card spans across the page */
  box-sizing: border-box; /* Include padding and borders in the width calculation */
}

.q-page-container {
  padding-top: 55px !important;
  overflow-x: auto; /* Ensure the container can scroll horizontally */
}

.q-table {
  min-width: 100%; /* Ensure table spans beyond the viewport */
}
</style>
