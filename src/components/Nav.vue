<template>
    <nav>
        <v-app-bar flat app>
            <v-toolbar-title class="text-uppercas grey--text">
                <v-btn text class="font-weight-light" @click="index" elevation="0">
                    <span>Sketch2Art</span>
                </v-btn>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text color="black" @click="sketcher" elevation="0">
                <span>Sketchbook</span>
            </v-btn>
            <v-btn text color="black" @click="gallery" elevation="0">
                <span>Gallery</span>
            </v-btn>
            <v-btn text color="black" href="https://github.com/sketch2art" elevation="0">
                <span>Github</span>
            </v-btn>
        </v-app-bar>
    </nav>
</template>

<script>
export default {
    name: 'Index',
    components: {
    },
    methods: {
        index () { this.$router.push('/') },
        sketcher () { this.$router.push('/sketchbook') },
        gallery () { this.$router.push('/gallery') }
    },
    data () {
        return {
            drawer: true
        }
    }
}
</script>

<style>
#v-btn {
    background: white;
    margin-right: 0px;
}
#canvas {
    border: 2px dotted black;
    height: 512px;
    width: 512px;
}

</style>