<template>
    <v-layout id="home">
        <Index/>
        <UnivCanvas/>
    </v-layout>
</template>

<script>
import Index from '../components/Index'
export default {
    
    name: 'Home',
    components: {
        Index
    },
    methods: {
        sketcher () { this.$router.push('/sketcher') },
        gallery () { this.$router.push('/gallery') }
    }
}
</script>
<style scoped>

</style>
