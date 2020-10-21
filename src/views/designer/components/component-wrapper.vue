<template lang="pug">
component.component-wrapper(
    :is='component.name'
    ref='component'
    v-bind='props'
    @click.native.stop='onClick'
    :class='{"c-active": isActive}'
    v-drag-wrapper
)
    // 用来测试是否存在相关slot
    template(v-if='testingSlot' v-slot:[testingSlot])
        component.slot-test(
            v-if='hasChildren'
            :is='component.children[0].name'
            ref='testingSlot')
        .slot-test(v-else ref='testingSlot') test

    // slot内容
    template(v-for='slot in slots' v-slot:[slot])
        template(v-if='slot==="default" && (!slotComponents[slot] || !slotComponents[slot].length)')
            component(
                v-if='hasChildren'
                :is='component.children[0].name'
                ) {{component.name}}
            template(v-else) {{component.name}}
        component-wrapper(
            v-else
            v-for='(child, i) in slotComponents[slot]'
            :key='child._id'
            :component='child'
            @delete='onChildDelete(slotComponents[slot], i)')

        component.drop-area(
            v-if='dragging && hasChildren'
            :is='component.children[0].name'
            :class='{active: activeSlotId===slot}'
            v-drop="{drop: onDrop, dragEnter: () => activeSlotId=slot, dragLeave: () => activeSlotId=null}"
        )
        .drop-area(
            v-else-if='dragging'
            :class='{active: activeSlotId===slot}'
            v-drop="{drop: onDrop, dragEnter: () => activeSlotId=slot, dragLeave: () => activeSlotId=null}"
        )
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DRAG, DESIGNER } from '../../../store/types'
import DragWrapper from '../directives/drag-wrapper'
import { Drop } from '../directives/drag-drop'

export default Vue.extend({
    name: 'ComponentWrapper',
    components: {
        Drop
    },
    directives: {
        DragWrapper,
        Drop
    },
    props: {
        component: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters([
            'dragging',
            'dragPayload',
            'activeComponent',
            'activeProps'
        ]),
        isActive () {
            return this.activeComponent === this.refComponent
        },
        hasChildren () {
            return this.component.children && this.component.children.length
        }
    },
    beforeDestroy () {
        if (this.isActive) {
            this.$store.commit(DESIGNER.ACTIVATE, null)
        }
    },
    watch: {
        activeProps (now) {
            if (this.isActive) {
                const props = {}
                now.forEach(item => {
                    if (typeof item.value !== 'undefined' && item.value !== '') {
                        props[item.key] = item.value
                    }
                })
                this.props = props
            }
        }
    },
    data () {
        return {
            children: [],
            slots: [],
            slotComponents: {},
            activeSlotId: '',
            testingSlot: null,
            refComponent: null,
            props: {}
        }
    },
    mounted () {
        if (this.$refs.component) {
            console.log(this.$refs.component._props, this.component)
            const propKeys = ['default', ...Object.keys(this.$refs.component._props || {})]
            this.checkSlotKey(propKeys).then(() => {
                this.testingSlot = null
            })
            this.refComponent = this.$refs.component
        }
    },
    methods: {
        checkSlotKey (keys) {
            if (!keys.length) {
                return Promise.resolve()
            }
            const key = keys.shift()
            return new Promise(resolve => {
                this.testingSlot = key
                this.$nextTick(async () => {
                    if (this.$refs.testingSlot) {
                        this.slots.push(key)
                    }
                    await this.checkSlotKey(keys)
                    resolve()
                })
            })
        },
        onDrop () {
            if (this.activeSlotId) {
                if (!this.slotComponents[this.activeSlotId]) {
                    this.$set(this.slotComponents, this.activeSlotId, [])
                }
                this.slotComponents[this.activeSlotId].push({
                    ...this.dragPayload,
                    _id: Date.now()
                })
            }
            this.$store.commit(DRAG.END)
        },
        onClick () {
            this.$store.commit(DESIGNER.ACTIVATE, this.$refs.component)
        },
        onChildDelete (set, index) {
            set.splice(index, 1)
        }
    }
})
</script>
<style lang="sass" scoped>
.component-wrapper
    border: 1px dashed #1890ff
    min-height: 8px
    &.c-active
        border-color: #52c41a
        border-style: solid

</style>
