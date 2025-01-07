<template>
<!-- Header for Desktop -->
<q-header class="col-md-10 offset-md-1" v-if="$q.platform.is.desktop" elevated>
      <q-toolbar class="q-my-sm">
        <q-toolbar-title class="text-center">
          QUMSE
        </q-toolbar-title>

        <q-input class="absolute-right q-px-sm" style="margin-top: -3px;" color="white" outlined v-model="text">
          <template v-slot:append>
            <i class="fa-solid fa-magnifying-glass" style="color: white;"/>
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <!-- Header for Mobile -->
    <q-header class="col-md-10 offset-md-1" v-if="$q.platform.is.mobile" elevated>
      <q-toolbar class="q-my-sm">
        <q-btn 
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        
        <q-input v-show="showSearchBar" class="q-px-sm" style="margin-top: -3px;" color="white" outlined v-model="text" />
        <q-toolbar-title v-show="!showSearchBar" class="absolute-center">
          QUMSE
        </q-toolbar-title>

        <q-btn flat class="absolute-right" icon="fa-solid fa-magnifying-glass" color="white"  @click="toggleSearchBar"/>
      </q-toolbar>
    </q-header> 
</template>
  
<script>
import { Platform } from 'quasar';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainHeader',
  props: {},

  data(){
    return {
      leftDrawerOpen: false,
      showSearchBar: false,
    }
  },
  methods: {
    toggleLeftDrawer () {
        this.leftDrawerOpen = !this.leftDrawerOpen
      },
    toggleSearchBar(){
      if(Platform.is.mobile){
        this.showSearchBar = !this.showSearchBar;
      }
    }
  }
});


</script>
  