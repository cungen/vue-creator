<template lang="pug">
.component-decorator(@mouseover='onMouseOver' @mouseout='onMouseOut')
    .outline(:style='style.outline' v-show='show')
    .opts(:style='style.opts' v-show='show')
        a.op-item.danger(href='javascript:;' @click='onDelete')
            a-icon(type="delete")
    .active(:style='style.active')

</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
    props: {
        relatedNode: Object as PropType<Vue>,
        clickNode: Object as PropType<Vue>
    },
    data () {
        return {
            show: false,
            style: {
                outline: {},
                opts: {},
                active: {}
            },
            hideTimer: 0
        }
    },
    watch: {
        relatedNode (node: Vue) {
            if (node) {
                this.show = true
                this.updateStyle(node.$el as HTMLElement)
                this.cancelHide()
            } else {
                this.show = false
            }
        },
        clickNode (node: Vue) {
            if (node) {
                const ele = node.$el as HTMLElement
                const { left, top, width, height } = ele.getBoundingClientRect()
                this.style.active = {
                    left: Number(left) - 2 + 'px',
                    top: Number(top) - 2 + 'px',
                    width: Number(width) + 4 + 'px',
                    height: Number(height) + 4 + 'px'
                }
            } else {
                this.style.active = {}
            }
        }
    },
    mounted () {
        this.$on('hide', this.hide)
    },
    methods: {
        updateStyle (ele: HTMLElement) {
            const { left, top, width, height } = ele.getBoundingClientRect()
            this.style.outline = {
                left: Number(left) - 2 + 'px',
                top: Number(top) - 2 + 'px',
                width: Number(width) + 4 + 'px',
                height: Number(height) + 4 + 'px'
            }
            this.style.opts = {
                left: Number(left + width) + 'px',
                top: Number(top) + 'px'
            }
        },
        onDelete () {
            this.show = false
            this.relatedNode.$emit('delete')
            this.style.active = {}
        },
        cancelHide () {
            if (this.hideTimer) {
                clearTimeout(this.hideTimer)
                this.hideTimer = 0
            }
        },
        hide () {
            this.cancelHide()
            this.hideTimer = setTimeout(() => {
                this.show = false
                this.$props.relatedNode = null
            }, 400)
        },
        onMouseOver () {
            this.cancelHide()
        },
        onMouseOut (e: MouseEvent) {
            if (this.relatedNode.$el.contains(e.relatedTarget as HTMLElement)) {
                return
            }
            this.hide()
        }
    }
})
</script>

<style lang="sass" scoped>
.component-decorator
    .outline, .active
        position: fixed
        z-index: 10000
        border-radius: 2px
        border: 1px solid rgba(#1890ff, 0.7)
        pointer-events: none
    .active
        border-color: rgba(#f81d22, 0.5)

    .opts
        position: fixed
        z-index: 10000
        overflow: hidden
        padding: 0 4px
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
