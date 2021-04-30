<template>
  <v-layout id="Sketcher">
    <mobileSketch/>
    <ImageCard
        class="mx-auto my-4"
        v-for="(img, idx) in getImages"
        :key="idx"
        :image=img
      />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
// import Sketch from '../components/sketch.vue'
import mobileSketch from '../components/mobileSketch'
import ImageCard from '../components/ImageCard'
export default {
  name: 'Sketcher',
  components: {
    // Sketch,
    mobileSketch,
    ImageCard
  },
  data: () => ({

  }),
  computed: {
    ...mapGetters(['getImages'])
  }
}
</script>

<style>

</style>