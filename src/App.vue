<template lang="pug">
#app
    .app-header
        nav-bar
            template(v-slot:brand)
    .app-content
        router-view
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from './components/nav-bar/index.vue'

export default Vue.extend({
    components: {
        NavBar
    }
})
</script>

<style lang="sass">
body
    margin: 0
#app
    font-family: Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    color: #2c3e50
    display: flex
    height: 100vh
    flex-direction: column
.app-content
    flex: 1 1 100%
    overflow: hidden

</style>
