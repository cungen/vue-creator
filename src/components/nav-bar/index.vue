<template lang='pug'>
.nav-bar
    h1
        slot(name='brand')

</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
$nav-height: 48px

h1
    margin: 0
    font-size: 20px
    font-weight: 600
.nav-bar
    height: $nav-height
    line-height: $nav-height
    padding: 0 16px
    background: #35363a
    color: #fff

</style>
