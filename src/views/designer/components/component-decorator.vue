<template lang="pug">
.component-decorator(v-if='initialized' @mouseout='onMouseOut' @mousemove='onMouseMove' @dragover='onDragOver')
    .outline(:style='style.outline' :class='{dragging: dragging}' v-show='show' v-drop='dropBinding()')
    .opts(ref='opts' :style='style.opts' v-show='show && !dragging')
        //- div(v-if='relatedNode && relatedNode.componentOptions') {{relatedNode.componentOptions.tag}}
        a.op-item.danger(href='javascript:;' @click='onDelete')
            a-icon(type="delete")
    .active(:style='style.active')
    .slot-menus(ref='slots' v-show='show && dragging' :style='style.opts' v-drop='dropBinding()')
        .s-title {{componentName || '当前组件'}}的slots
        .s-item.drop-area(
            v-for='(slot, i) in slots'
            :key='i'
            :class='{"s-active": activeSlot===slot}'
            v-drop='dropBinding(slot)'
        ) &num;{{slot}}

        .parent(v-if='parentNode')
            .s-title 父组件( {{parentComponentName}} )的slots
            .s-item.drop-area(
                v-for='(slot, i) in parentNode.slots'
                :key='i'
                :class='{"s-active": activeSlot===slot + "_parent"}'
                v-drop='dropBinding(slot + "_parent", true)'
            ) &num;{{slot}}

</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Drop } from '../directives/drag-drop'
import store from '../../../store'
import _ from 'lodash'

interface ComponentItem extends Vue {
    slots: string[];
}

interface VueHtmlElement extends HTMLElement {
    __vue__: Vue;
    _cgContext: ComponentItem;
}

export default Vue.extend({
    props: {
        relatedNode: Object as PropType<ComponentItem>,
        dragging: Boolean
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
            hideTimer: 0 as null|number,
            activeSlot: '',
            onMouseMove: null as null|Function,
            initialized: false,
            clickNode: null as null|ComponentItem
        }
    },
    computed: {
        componentName () {
            const vueIns = (this.relatedNode?.$el as VueHtmlElement).__vue__ as Vue
            if (vueIns) {
                return vueIns.$vnode?.componentOptions?.tag || ''
            }
            return ''
        },
        parentNode (): null|ComponentItem {
            if (this.relatedNode) {
                const parentEl = this.relatedNode.$el.parentElement as HTMLElement
                const wrapperEl = parentEl.closest('.component-wrapper') as VueHtmlElement
                if (wrapperEl) {
                    return wrapperEl._cgContext
                }
            }
            return null
        },
        parentComponentName () {
            const vueIns = (this.parentNode?.$el as VueHtmlElement).__vue__ as Vue
            if (vueIns) {
                return vueIns.$vnode?.componentOptions?.tag || ''
            }
            return ''
        },
        slots () {
            if (this.relatedNode) {
                return this.relatedNode.slots || []
            }
            return []
        }
    },
    watch: {
        relatedNode (node: Vue) {
            if (node) {
                this.show = true
                this.updateStyle(node.$vnode.elm as HTMLElement)
                this.cancelHide()
            } else {
                this.show = false
            }
        }
    },
    mounted () {
        this.$on('hide', this.hide)
        // watch active component change
        this.$watch(() => {
            return store.getters.activeComponent
        }, (now) => {
            this.clickNode = now
            if (now) {
                this.updateActiveStyle()
            } else {
                this.hide()
                this.style.active = {}
            }
        })
        // watch props change
        this.$watch(() => {
            return store.getters.activeProps
        }, () => {
            if (this.clickNode === store.getters.activeComponent) {
                this.$nextTick(() => {
                    this.updateActiveStyle()
                })
            } else {
                this.hide()
                this.style.active = {}
            }
        })
        this.onMouseMove = _.throttle(this.rawOnMouseMove, 300, { trailing: true })
        this.initialized = true
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
                const ele = node.$vnode.elm as HTMLElement
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
            this.relatedNode.$emit('delete')
            this.style.active = {}
        },
        cancelHide () {
            if (this.hideTimer) {
                clearTimeout(this.hideTimer)
                this.hideTimer = null
            }
        },
        hide () {
            if (this.hideTimer) {
                return
            }
            this.hideTimer = setTimeout(() => {
                this.show = false
                this.$props.relatedNode = null
                this.hideTimer = null
            }, 400)
        },
        dropBinding (slot: string, isParent = false) {
            return {
                drop: (e: DragEvent) => {
                    this.onSlotDrop(slot, isParent)
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
        onMouseOut (e: MouseEvent) {
            if ((this.$refs.opts as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
                return
            }
            this.hide()
        },
        rawOnMouseMove (e: MouseEvent) {
            this.cancelHide()
            e.stopPropagation()
        },
        onDragOver (e: DragEvent) {
            this.cancelHide()
            e.stopPropagation()
        },
        onSlotDrop (slot: string, isParent = false) {
            const node = isParent ? this.parentNode : this.relatedNode
            if (node) {
                node.$emit('drop', slot ? slot.replace('_parent', '') : this.slots[0])
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
        &.dragging
            pointer-events: auto
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
        padding: 4px 8px
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.05)
        .s-title
            padding: 4px 0 0
            margin-bottom: 4px
            color: #999
            font-size: 0.8em
        .drop-area
            position: relative
            padding: 4px 8px
            min-width: 120px
            font-size: 0.9em
            margin-bottom: 4px
            color: #999
            text-align: center
            border: 1px dotted rgba($green, 0.8)
        .s-active
            border: 1px dotted rgba($red, 0.8)
            background: rgba($red, 0.1)

</style>
