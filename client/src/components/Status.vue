<template lang="html">

  <section class="status" v-if="polling">
    <div class="done" v-if="status.done">Done generating heatmap</div>
    <div v-else>
      <div v-if="!status.searchDone">Searching, got {{status.listingsCount}} so far</div>
      <div v-else>
        Finished searching, got {{status.listingsCount}} total listings, calculating demand, {{demandPercent}}% done
      </div>
    </div>
  </section>

</template>

<script lang="js">
  export default {
    name: 'status',
    props: [],
    mounted() {

    },
    data() {
      return {

      };
    },
    methods: {

    },
    computed: {
      status() {
        return this.$store.state.status;
      },
      polling() {
        return this.$store.state.polling;
      },
      demandPercent() {
        const status = this.status;
        if (status.demand === 0) {
          return 0;
        }
        return Number((status.demandDone / status.demand) * 100).toFixed(2);
      },
    },
};
</script>

<style scoped lang="scss">
  .status {

  }
</style>
