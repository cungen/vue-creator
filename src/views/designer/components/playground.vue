<template lang="pug">
.playground
    ComponentWrapper(v-for='child in children' :component='child' :key='child._id')
    drop.drop-area(
        v-if='dragging'
        :class='{active: activeId==="new"}'
        @drop='onDrop'
        @dragenter="activeId='new'"
        @dragleave="activeId=''")
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Drop } from 'vue-drag-drop'
import { DRAG } from '../../../store/types'
import ComponentWrapper from './component-wrapper.vue'

export default Vue.extend({
    components: {
        Drop,
        ComponentWrapper
    },
    computed: {
        ...mapGetters([
            'dragging',
            'dragPayload'
        ])
    },
    data () {
        return {
            children: [] as DragPayload[],
            activeId: ''
        }
    },
    methods: {
        onDrop () {
            this.$store.commit(DRAG.END)
            this.children.push({
                ...this.dragPayload,
                _id: Date.now()
            })
        }
    }
})
</script>

<style lang="sass" scoped>
$red: #f81d22

.playground
    &::v-deep
        .drop-area
            border: 1px dashed $red
            padding: 5px
            margin: 5px
            border-radius: 4px
            min-height: 20px
            height: 100%
            overflow: hidden
            &.active
                background: rgba($red, 0.2)

</style>
