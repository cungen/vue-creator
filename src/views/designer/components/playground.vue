<template lang="pug">
.playground
    ComponentWrapper(v-for='(child, i) in children' :component='child' :key='child._id' @delete='onDelete(i)')
    .drop-area(
        v-if='dragging'
        :class='{active: activeId==="new"}'
        v-drop="{drop: onDrop, dragEnter: () => activeId = 'new', dragLeave: () => activeId = ''}"
    )
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DRAG } from '../../../store/types'
import { Drop } from '../directives/drag-drop'
import ComponentWrapper from './component-wrapper.vue'

export default Vue.extend({
    components: {
        ComponentWrapper
    },
    directives: {
        drop: Drop
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
        },
        onDelete (index: number) {
            this.children.splice(index, 1)
        }
    }
})
</script>

<style lang="sass" scoped>
$red: #f81d22

.playground
    padding: 20px
    &::v-deep
        .drop-area
            border: 1px dashed $red
            padding: 5px
            margin: 5px
            border-radius: 4px
            min-height: 20px
            overflow: hidden
            &.active
                background: rgba($red, 0.2)

</style>
