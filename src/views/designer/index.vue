<template lang="pug">
.designer
    .d-left
        packages
    .d-center
        playground
    .d-right
        component-props

</template>

<script>
import Packages from './components/packages.vue'
import Playground from './components/playground.vue'
import ComponentProps from './components/component-props.vue'

export default {
    components: {
        Packages,
        Playground,
        ComponentProps
    }
}
</script>

<style lang="sass" scoped>
$left: 180px
$right: 200px

.designer
    display: flex
    flex-direction: row
    height: 100%
    .d-left
        flex: 0 0 $left
        height: 100%
        overflow: auto
        background: #eee
        border-right: 1px solid #f0f0f0
    .d-center
        flex: 1 1 auto
    .d-right
        flex: 0 0 $right
        height: 100%
        overflow: auto
        background: #eee
        border-left: 1px solid #f0f0f0

</style>
