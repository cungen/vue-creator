<template lang="pug">
.component-decorator(@mouseover='onMouseOver' @mouseout='onMouseOut')
    .outline(:style='style.outline' v-show='show')
    .opts(ref='opts' :style='style.opts' v-show='show && !dragging')
        //- div(v-if='relatedNode && relatedNode.componentOptions') {{relatedNode.componentOptions.tag}}
        a.op-item.danger(href='javascript:;' @click='onDelete')
            a-icon(type="delete")
    .active(:style='style.active')
    .slot-menus(ref='slots' v-show='show && dragging' :style='style.opts' v-drop='dropBinding()')
        .s-title {{componentName}}的slots
        .s-item
            .drop-area(
                v-for='(slot, i) in slots'
                :key='i'
                :class='{"s-active": activeSlot===slot}'
                v-drop='dropBinding(slot)'
            ) &num;{{slot}}

</template>

<script lang="ts">
import Vue, { PropType, VNode } from 'vue'
import { Drop } from '../directives/drag-drop'

export default Vue.extend({
    props: {
        relatedNode: Object as PropType<VNode>,
        clickNode: Object as PropType<VNode>,
        dragging: Boolean,
        slots: Array as PropType<string[]>,
        onDrop: Function
    },
    directives: { Drop },
    data () {
        return {
            show: false,
            style: {
                outline: {},
                opts: {},
                active: {}
            },
            hideTimer: 0,
            activeSlot: ''
        }
    },
    computed: {
        componentName () {
            return this.relatedNode?.componentOptions?.tag || ''
        }
    },
    watch: {
        relatedNode (node: VNode) {
            if (node) {
                this.show = true
                this.updateStyle(node.elm as HTMLElement)
                this.cancelHide()
            } else {
                this.show = false
            }
        },
        clickNode () {
            this.updateActiveStyle()
        },
        'clickNode.props' () {
            // wait for the element changed
            this.$nextTick(() => {
                if (this.relatedNode) {
                    this.updateActiveStyle()
                    this.updateStyle(this.relatedNode.elm as HTMLElement)
                } else {
                    this.hide()
                    this.style.active = {}
                }
            })
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
        updateActiveStyle () {
            const node = this.clickNode
            if (node) {
                const ele = node.elm as HTMLElement
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
        },
        onDelete () {
            this.show = false
            const context = this.relatedNode.context as Vue
            context.$emit('delete')
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
        dropBinding (slot: string) {
            return {
                drop: (e: DragEvent) => {
                    this.onSlotDrop(slot)
                    e.stopPropagation()
                },
                dragEnter: (e: DragEvent) => {
                    this.cancelHide()
                    this.activeSlot = slot
                    e.stopPropagation()
                },
                dragLeave: (e: DragEvent) => {
                    if ((this.$refs.slots as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
                        return
                    }
                    this.activeSlot = this.slots[0]
                    this.hide()
                }
            }
        },
        onMouseOver () {
            this.cancelHide()
        },
        onMouseOut (e: MouseEvent) {
            if ((this.$refs.opts as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
                return
            }
            this.hide()
        },
        onSlotDrop (slot: string) {
            if (this.onDrop) {
                this.onDrop(slot || this.slots[0])
            }
            this.$props.relatedNode = null
            this.show = false
        }
    }
})
</script>

<style lang="sass" scoped>
$red: #f81d22
$green: #42b983
$blue: #1890ff

.component-decorator
    .outline, .active
        position: fixed
        z-index: 10000
        border-radius: 2px
        border: 1px solid rgba($blue, 0.7)
        pointer-events: none
    .active
        border-color: rgba($red, 0.5)

    .opts, .slot-menus
        position: fixed
        z-index: 10000
        overflow: hidden
        margin-left: 4px
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
    .slot-menus
        background: #fff
        border-radius: 4px
        border: 1px solid #f0f0f0
        padding: 4px 0
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.05)
        .s-title
            padding: 4px 8px 0
            color: #999
            font-size: 0.8em
        .s-item
            position: relative
            padding: 4px 8px
            min-width: 120px
            font-size: 0.9em
            line-height: 26px
            margin-bottom: 4px
            .drop-area
                color: #999
                text-align: center
                border: 1px dotted rgba($green, 0.8)
            .s-active
                border: 1px dotted rgba($red, 0.8)
                background: rgba($red, 0.1)

</style>
