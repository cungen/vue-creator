<template lang="pug">
.drag-wrapper__opt(v-if='show' @click.stop='')
    a.op-item(href='javascript:;' @click='$emit("copy")')
        a-icon(type="copy")
    a.op-item.danger(href='javascript:;' @click='$emit("delete")')
        a-icon(type="delete")

</template>

<script>
export default {
    props: {
        show: {
            default: true
        }
    }
}
</script>

<style lang="sass" scoped>
.drag-wrapper__opt
    position: absolute
    right: 0
    top: 0
    overflow: hidden
    z-index: 10

.op-item
    display: inline-block
    width: 20px
    height: 20px
    line-height: 20px
    text-align: center
    background: #ddd
    font-size: 12px
    cursor: pointer
    color: #666
    &.danger
        background: #f9c1bd

</style>
