<template>
  <div id="APP">
    <Nav/>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>
<script>
import Nav from "./components/Nav"
export default {
  name: 'App',
  components: {
    Nav
  },
  data: () => ({
    //
  }),
};
</script>
<style>
</style>