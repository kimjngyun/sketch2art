<template>
    <v-layout id="home">
        <Index/>
        <!-- <hello-world/> -->
    </v-layout>
</template>

<script>
import Index from '../components/Index'
// import HelloWorld from '../components/HelloWorld.vue'
export default {
    
    name: 'Home',
    components: {
        Index
        // HelloWorld
    },
    methods: {
        sketcher () { this.$router.push('/sketcher') },
        gallery () { this.$router.push('/gallery') }
    }
}
</script>
<style scoped>

</style>
