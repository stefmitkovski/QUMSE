<template>
  <q-layout view="lHh Lpr lFf" class="row">

    <MainHeader />

    <q-drawer v-if="$q.platform.is.mobile"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      >

    </q-drawer>

    <LastTradedShares />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import MainHeader from 'src/components/MainHeader.vue'
import LastTradedShares from 'src/components/LastTradedShares.vue';


export default defineComponent({
  name: 'MainLayout',

  components: {
    MainHeader,
    LastTradedShares
  },

  data(){
    return {
    }
  },
  methods: {
  }
})
</script>