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
            <q-route-tab
              name="home"
              to="/"
              :label="$t('Home')"
              class="q-mx-sm"
            />
            <q-route-tab
              name="analyse"
              to="/analyse"
              :label="$t('Analyse')"
              class="q-mx-sm"
            />
            <q-route-tab
              name="download"
              to="/download"
              :label="$t('Download')"
              class="q-mx-sm"
            />
          </q-tabs>
        </div>
        <q-btn
          @click="toggleDarkMode"
          class="q-mx-sm"
          flat
          round
          :icon="darkMode ? 'dark_mode' : 'light_mode'"
        />
        <q-btn class="q-mx-sm" flat :label="lang" @click="changeLanguage" />
      </q-toolbar>
    </q-header>

    <q-header v-if="$q.platform.is.mobile" elevated>
      <q-toolbar>
        <q-btn
          @click="toggleDarkMode"
          class="q-mx-sm"
          flat
          round
          :icon="darkMode ? 'dark_mode' : 'light_mode'"
        />
        <q-space />
        <q-toolbar-title align="center"> QUMSE </q-toolbar-title>

        <q-space />
        <q-btn class="q-mx-sm" flat :label="lang" @click="changeLanguage" />
      </q-toolbar>

      <q-tabs active-color="secondary" align="center">
        <q-route-tab name="home" to="/" label="Home" />
        <q-route-tab name="analyse" to="/analyse" label="Analyse" />
        <q-route-tab name="download" to="/download" label="Download" />
      </q-tabs>
    </q-header>
  </div>
</template>

<script>
import { Platform } from "quasar";
import Utils from "src/assets/js/Utils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainHeader",
  props: {},

  data() {
    return {
      leftDrawerOpen: false,
      showSearchBar: false,
      tab: this.$route.name,
      lang: "",
      darkMode: false,
    };
  },

  mounted() {
    // Za lokalizacija
    const lang = localStorage.getItem("lang");
    if (Utils.hasValue(lang)) {
      this.lang = lang;
    } else {
      this.lang = "MK";
    }
    this.$i18n.locale = this.lang;

    // Za Dark Mode
    const darkMode = localStorage.getItem("darkMode");
    if (Utils.hasValue(darkMode)) {
      console.log("Current dark mode state:", darkMode);
      this.darkMode = darkMode === "true";
      this.$q.dark.set(this.darkMode);
    }
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
    changeLanguage() {
      if (this.lang === "MK") {
        this.lang = "EN";
      } else {
        this.lang = "MK";
      }

      this.$i18n.locale = this.lang;
      localStorage.setItem("lang", this.lang);
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.$q.dark.set(this.darkMode);
      localStorage.setItem("darkMode", this.darkMode.toString());
    },
  },
  watch: {
    $route(to) {
      this.tab = to.name;
    },
  },
});
</script>
