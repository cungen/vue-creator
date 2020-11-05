<template lang="pug">
.playground
    ComponentItem(v-for='(child, i) in children' :component='child' :key='child._id' @delete='onDelete(i)')
    drop-area(
        @drop='onDrop'
    )
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DRAG } from '../../../store/types'
import ComponentItem from './component-item.vue'
import DropArea from './drop-area.vue'

export default Vue.extend({
    components: {
        ComponentItem,
        DropArea
    },
    computed: {
        ...mapGetters([
            'dragPayload'
        ])
    },
    data () {
        return {
            children: [] as DragPayload[]
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

.playground
    height: 100%
    padding: 20px
.component-wrapper
    margin-bottom: 8px

</style>
