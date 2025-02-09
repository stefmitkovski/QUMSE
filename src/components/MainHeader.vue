<template>
  <!-- Header for Desktop -->
  <div class="row">
    <q-header
      class="col-md-10 offset-md-1"
      v-if="$q.platform.is.desktop"
      elevated
    >
      <q-toolbar>
        <q-toolbar-title shrink>QUMSE</q-toolbar-title>

        <div class="q-mx-auto">
          <q-tabs v-model="tab" active-color="secondary" shrink>
            <q-route-tab name="home" to="/" label="Home" class="q-mx-sm" />
            <q-route-tab
              name="analyse"
              to="/analyse"
              label="Analyse"
              class="q-mx-sm"
            />
            <q-route-tab
              name="download"
              to="/download"
              label="Download"
              class="q-mx-sm"
            />
            <q-route-tab
              name="calculator"
              to="/calculator"
              label="Calculator"
              class="q-mx-sm"
            />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>

    <q-header v-if="$q.platform.is.mobile" elevated>
      <q-toolbar>
        <q-toolbar-title align="center"> QUMSE </q-toolbar-title>
      </q-toolbar>

      <q-tabs active-color="secondary" align="center">
        <q-route-tab name="home" to="/" label="Home" />
        <q-route-tab name="analyse" to="/analyse" label="Analyse" />
        <q-route-tab name="calculator" to="/calculator" label="Calculator" />
      </q-tabs>
    </q-header>
  </div>
</template>

<script>
import { Platform } from "quasar";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainHeader",
  props: {},

  data() {
    return {
      leftDrawerOpen: false,
      showSearchBar: false,
      tab: this.$route.name,
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    toggleSearchBar() {
      if (Platform.is.mobile) {
        this.showSearchBar = !this.showSearchBar;
      }
    },
  },
  watch: {
    $route(to) {
      this.tab = to.name;
    },
  },
});
</script>
