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
              @update:model-value="onSelected"
              style="width: 100%"
            >
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
                  :color="item.color"
                  :val="item.value"
                />
              </q-item-section>
              <q-item-section @click="toggleCheckbox(item.value)">{{
                item.label
              }}</q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="more_vert"
                  @click="toggleMenu(item.value)"
                />
                <q-menu v-model="item.showMenu">
                  <q-list>
                    <q-item clickable @click="changeColorDialog(item)">
                      <q-item-section>
                        <q-item-label>Change color</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable @click="removeSelected(item)">
                      <q-item-section>
                        <q-item-label>Delete</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>

                <q-dialog v-model="showColorDialog">
                  <q-card>
                    <q-card-section>
                      <div class="text-weight-regular text-center">
                        Selected Color:
                        <div
                          :style="{ color: selectedColor, display: 'inline' }"
                        >
                          {{ selectedColor.toUpperCase() }}
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator spaced />

                    <q-card-section>
                      <div class="row q-mx-md">
                        <div
                          class="col-2"
                          v-for="(colour, index) in colours"
                          :key="index"
                        >
                          <q-btn
                            square
                            unelevated
                            :color="colour"
                            @click="changeColor(colour)"
                            class="full-width q-pa-sm"
                          />
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator spaced />
                    <q-card-actions align="right">
                      <q-btn
                        color="primary"
                        flat
                        label="Cancel"
                        @click="closeColorDialog"
                      />
                      <q-btn
                        color="primary"
                        flat
                        label="Confirm"
                        @click="applyColorDialog"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card>
      <!-- <q-card class="q-ma-md" style="max-width: 800px; width: 100%">
        <q-card-section>
          <apexchart
            type="area"
            :options="chartOptions"
            :series="series"
            height="350"
          />
        </q-card-section>
      </q-card> -->
    </q-page-container>
  </div>
</template>

<script>
import cyrillicToLatin from "cyrillic-romanization";
import httpUtils from "src/assets/js/httpUtils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AnalysePage",

  data() {
    return {
      companies: [], // Site kompanii
      selected: [], // Slektiranite kompanii
      options: [], // Kompaniite koi se pojavuvaat pri prebaruvanje
      model: [],
      colours: [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "blue-grey",
      ],
      showColorDialog: false, // Za dialogot za boi
      selectedColor: "", // Momentalno selektiranata boja
      selectedItem: "", // Momentalno selektiranata firma
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

    getRandomColour() {
      const randomIndex = Math.floor(Math.random() * this.colours.length);
      return this.colours[randomIndex];
    },

    onSelected(values) {
      const colour = this.getRandomColour();

      values.forEach((item) => {
        if (item.color == undefined) {
          item.color = colour;
          item.showMenu = false;
        }
      });

      // console.log(this.model)
    },
    toggleCheckbox(val) {
      const index = this.selected.indexOf(val);
      if (index !== -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(val);
      }
    },

    toggleMenu(val) {
      this.model.forEach((item) => {
        if (item.value == val) {
          item.showMenu = false;
        }
      });
    },

    removeSelected(val) {
      const index = this.model.findIndex((item) => item.value === val.value);
      if (index !== -1) {
        this.model[index].showMenu = false;
        this.model.splice(index, 1);
      }
    },

    changeColorDialog(val) {
      this.model.forEach((item) => {
        if (item.value == val.value) {
          this.selectedColor = item.color;
          this.selectedItem = item;
        }
      });
      this.showColorDialog = true;
    },

    changeColor(val) {
      this.selectedColor = val;
    },

    closeColorDialog() {
      this.showColorDialog = false;
    },

    applyColorDialog() {
      this.model.map((item) => {
        if (item.value == this.selectedItem.value) {
          item.color = this.selectedColor;
        }
      });
      this.selectedItem = "";
      this.selectedColor = "";
      this.showColorDialog = false;
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
  /* z-index: 10; */
  overflow-x: auto;
}
</style>
