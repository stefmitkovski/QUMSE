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
          flat
          round
          :icon="darkMode ? 'dark_mode' : 'light_mode'"
        />
        <q-btn
        class="q-mx-sm"
          @click="toggleIPDialog"
          flat
          icon="settings"
        />
        <q-btn flat :label="lang" @click="changeLanguage" />
      </q-toolbar>
    </q-header>

    <q-header v-if="$q.platform.is.mobile" elevated>
      <q-toolbar>
        <q-toolbar-title align="center"> QUMSE </q-toolbar-title>

        <q-btn
          style="position: absolute; right: 1px; top: 1px"
          flat
          icon="menu"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item align="center" clickable v-close-popup>
                <q-item-section @click="changeLanguage" expand>
                  {{ lang }}
                </q-item-section>
              </q-item>
              <q-item align="center" clickable v-close-popup>
                <q-item-section @click="toggleDarkMode">{{
                  darkMode ? $t("Dark") : $t("Light")
                }}</q-item-section>
              </q-item>
              <q-item align="center" clickable v-close-popup>
                <q-item-section @click="toggleIPDialog">{{
                  $t("IP")
                }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <q-tabs active-color="secondary" align="center">
        <q-route-tab name="home" to="/" :label="$t('Home')" class="q-mx-sm" />
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
    </q-header>
  </div>
</template>

<script>
import { Loading, Platform } from "quasar";
import httpUtils from "src/assets/js/httpUtils";
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
      IP: httpUtils.getIPAddress(),
      backupIP: "",
    };
  },

  beforeCreate() {
    const IP = localStorage.getItem("IP");
    if (Utils.hasValue(IP)) {
      console.log("IP ", IP);
      this.IP = IP;
    } else {
      this.IP = "localhost";
    }
    httpUtils.setIPAddreess(this.IP);
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

  beforeUnmount() {
    localStorage.setItem("IP", httpUtils.getIPAddress());
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

    toggleIPDialog() {
      this.backupIP = this.IP;
      this.$q
        .dialog({
          title: this.$t("IP_Title"),
          message: this.$t("IP_Body"),
          class: "text-center",
          prompt: {
            model: this.backupIP,
            isValid: (val) => Utils.isValidIPOrDomainOrLocalhost(val),
            type: "text",
          },
          cancel: {
            label: this.$t("Cancel"),
            flat: true,
            color: "primary",
          },
          ok: {
            label: this.$t("Confirm"),
            flat: true,
            color: "primary",
          },
          persistent: false,
          focus: "prompt",
        })
        .onOk((data) => {
          httpUtils.setIPAddreess(data);
          this.backupIP = data;
          this.IP = data;
          localStorage.setItem("IP", data);
          this.$router.go(0);
        })
        .onCancel(() => {
          this.backupIP = this.IP;
        })
        .onDismiss(() => {
          this.backupIP = this.IP;
        });
    },
  },
  watch: {
    $route(to) {
      Loading.show({
        message: this.$t("LoadingSwitchingTabs"),
      });

      this.tab = to.name;

      setTimeout(() => {
        Loading.hide();
      }, 1000);
    },
  },
});
</script>
