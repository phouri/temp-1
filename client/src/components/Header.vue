<template lang="html">

  <section class="header">
    <v-layout>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Airbnb Guesty Heatmap</h3>
            <div>Brooklyn is prefetched <br>Try other small locations for a small demo (Netivot for example) ...</div>
          </div>
        </v-card-title>
      </v-card>
  </v-layout>
  </section>

</template>

<script lang="js">
export default {
  name: 'app-header',
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

  },
};
</script>

<style scoped lang="scss">
  .header {
    min-width: 600px;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 20px;
    .card {
      width: 100%;
    }
  }
</style>
