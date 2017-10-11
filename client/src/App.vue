<template>
  <div id="app">
    <v-app>
      <app-header />
      <location />
      <status />
      <heat-map />
    </v-app>
  </div>
</template>

<script>
import Location from './components/Location';
import HeatMap from './components/Map.vue';
import Status from './components/Status';
import AppHeader from './components/Header';

export default {
  name: 'app',
  components: {
    Location,
    HeatMap,
    Status,
    AppHeader,
  },
};

</script>

<style>
#app {}
</style>
