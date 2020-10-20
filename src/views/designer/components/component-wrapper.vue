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
        .slot-test(ref='testingSlot')

    // slot内容
    template(v-for='slot in slots' v-slot:[slot])
        template(v-if='slot==="default" && (!slotComponents[slot] || !slotComponents[slot].length)')
            #{childTag} {{component.name}}
        component-wrapper(
            v-else
            v-for='(child, i) in slotComponents[slot]'
            :key='child._id'
            :component='child'
            @delete='onChildDelete(slotComponents[slot], i)')

        drop.drop-area(
            :tag='childTag'
            v-if='dragging'
            :class='{active: activeSlotId===slot}'
            @drop='onDrop'
            @dragenter="activeSlotId=slot"
            @dragleave="activeSlotId=''")
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Drop } from 'vue-drag-drop'
import { DRAG, DESIGNER } from '../../../store/types'
import DragWrapper from '../directives/drag-wrapper'

export default Vue.extend({
    name: 'ComponentWrapper',
    components: {
        Drop
    },
    directives: {
        DragWrapper
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
        childTag () {
            return this.$el.tagName === 'UL' || this.$el.tagName === 'OL' ? 'li' : 'div'
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
            const propKeys = ['default', ...Object.keys(this.$refs.component._props)]
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
    padding: 6px 0
    border-radius: 2px
    &.c-active
        border-color: #52c41a
        border-style: solid

</style>
