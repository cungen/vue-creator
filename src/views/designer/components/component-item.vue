<template lang="pug">
component.component-wrapper(
    :is='component.name'
    ref='component'
    v-bind='props'
    @click.native.stop='onClick'
    :class='{"c-active": isActive}'
    v-component-decorator
)
    // 用来测试是否存在相关slot
    //- template(v-if='testingSlot' v-slot:[testingSlot])
        component.slot-test(
            v-if='hasChildren'
            :is='component.children[0].name'
            ref='testingSlot')
        .slot-test(v-else ref='testingSlot') test

    // slot内容
    template(v-for='slot in slots' v-slot:[slot])
        //- template(v-if='slot==="default" && (!slotComponents[slot] || !slotComponents[slot].length)')
            component(
                v-if='hasChildren'
                :is='component.children[0].name'
                ) {{component.name}}
        component-item(
            v-for='(child, i) in slotComponents[slot]'
            :key='child._id'
            :component='child'
            @delete='onChildDelete(slotComponents[slot], i)')

        drop-area(
            v-if='dragging || slot==="default" && (!slotComponents[slot] || !slotComponents[slot].length)'
            ref='slot'
            :tag='dropTag'
            :placeholder='"#" + slot'
            @drop='onDrop(slot)'
        )
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DRAG, DESIGNER } from '../../../store/types'
import ComponentDecorator from '../directives/component-decorator'
import { Drop } from '../directives/drag-drop'
import DropArea from './drop-area.vue'

export default Vue.extend({
    name: 'ComponentItem',
    props: {
        component: {
            type: Object,
            required: true
        }
    },
    components: {
        Drop,
        DropArea
    },
    directives: {
        ComponentDecorator,
        Drop
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
    computed: {
        ...mapGetters([
            'dragging',
            'dragPayload',
            'activeComponent',
            'activeProps',
            'activeDbl'
        ]),
        isActive () {
            return this.activeComponent === this.refComponent
        },
        hasChildren () {
            return this.component.children && this.component.children.length
        },
        isFocus () {
            return this.$slots.drop.indexOf(document.activeElement) !== -1
        },
        dropTag () {
            const parentTag = this.$el.nodeName.toLowerCase()
            const childMap = {
                span: 'span', table: 'tr', tr: 'td', ol: 'li', ul: 'li', dl: 'dd', button: 'div'

            }
            return childMap[parentTag] || 'div'
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
        },
        activeDbl (now) {
            if (this.isFocus) {
                console.log(now)
            }
        }
    },
    mounted () {
        if (this.$refs.component) {
            this.slots = this.component.slots || []
            // const propKeys = ['default', ...Object.keys(this.$refs.component._props || {})]
            // this.checkSlotKey(propKeys).then(() => {
            //     this.testingSlot = null
            // })
            this.refComponent = this.$refs.component
        }
        this.props = this.component.defaultProps || {}
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
        onDrop (slotName) {
            if (!this.slotComponents[slotName]) {
                this.$set(this.slotComponents, slotName, [])
            }
            this.slotComponents[slotName].push({
                ...this.dragPayload,
                _id: Date.now()
            })
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
</style>
