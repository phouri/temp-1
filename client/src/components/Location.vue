<template lang="html">

  <section class="location">
      <v-text-field :disabled="polling" label="Enter location" v-model="location" type="text" />    
      <v-btn :disabled="polling || location.length < 2" @click="searchLocation()" color="red">Search</v-btn>
      <v-btn :disabled="!polling" @click="cancel()" color="black">Cancel</v-btn>
  </section>
</template>

<script lang="js">
  export default {
    name: 'location',
    props: [],
    components: {
    },
    mounted() {

    },
    data() {
      return {

      };
    },
    methods: {
      searchLocation() {
        this.$store.dispatch('getPoints');
      },
    },
    computed: {
      polling() {
        this.$store.dispatch('cancelSearch');
      },
      location: {
        get() {
          return this.$store.state.location;
        },
        set(v) {
          this.$store.commit('set_location', v);
        },
      },
    },
};

</script>

<style scoped lang="scss">
.location {
  max-width: 800px;
  min-width: 600px;
  margin: 0 auto;
  display: flex;
}
</style>
