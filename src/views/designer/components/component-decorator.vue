<template lang="pug">
.component-decorator(@mouseover='onMouseOver' @mouseout='onMouseOut' v-show='show')
    .outline(:style='style.outline')
    .opts(:style='style.opts')
        a.op-item.danger(href='javascript:;' @click='onDelete')
            a-icon(type="delete")

</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

interface VueElement extends HTMLElement {
    __vue__: Vue;
}

export default Vue.extend({
    props: {
        relatedEle: Object as PropType<VueElement>
    },
    data () {
        return {
            show: false,
            style: {
                outline: {},
                opts: {}
            },
            hideTimer: 0
        }
    },
    watch: {
        relatedEle (ele: VueElement) {
            if (ele) {
                console.log(ele.__vue__)
                this.show = true
                this.updateStyle(ele)
                this.cancelHide()
            } else {
                this.show = false
            }
        }
    },
    mounted () {
        this.$on('hide', this.hide)
    },
    methods: {
        updateStyle (ele: HTMLElement) {
            const { left, top, width, height } = ele.getClientRects()[0]
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
            const com = this.relatedEle.__vue__
            com.$emit('delete')
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
                this.$props.relatedEle = null
            }, 400)
        },
        onMouseOver () {
            this.cancelHide()
        },
        onMouseOut () {
            this.hide()
        }
    }
})
</script>

<style lang="sass" scoped>
.component-decorator
    .outline
        position: fixed
        z-index: 10000
        border-radius: 2px
        border: 1px solid rgba(#1890ff, 0.7)
        pointer-events: none

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
