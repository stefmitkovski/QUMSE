<template>
  <q-layout view="lHh Lpr lFf">
    <MainHeader />

    <q-drawer
      v-if="$q.platform.is.mobile"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
    </q-drawer>

    <MainTradedShares />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import MainHeader from "src/components/MainHeader.vue";
import MainTradedShares from "src/components/MainTradedShares.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    MainHeader,
    MainTradedShares,
  },
});
</script>

