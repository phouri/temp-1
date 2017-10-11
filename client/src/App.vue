<template>
  <div id="app">
    <v-app>
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

export default {
  name: 'app',
  components: {
    Location,
    HeatMap,
    Status,
  },
};

</script>

<style>
#app {}
</style>
