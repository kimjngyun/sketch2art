import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sketcher from '../views/SketchBook.vue'
import Gallery from '../views/Gallery.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/sketchbook',
        name: 'SketchBook',
        component: Sketcher
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: Gallery
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router