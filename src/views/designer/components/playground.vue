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
import { DRAG, DESIGNER } from '../../../store/types'
import ComponentItem from './component-item.vue'
import DropArea from './drop-area.vue'
import { initDecorator } from '../directives/component-decorator'

export default Vue.extend({
    components: {
        ComponentItem,
        DropArea
    },
    computed: {
        ...mapGetters([
            'dragPayload',
            'activeDbl'
        ])
    },
    watch: {
        activeDbl (now) {
            if (now) {
                this.addChild(now)
                this.$store.commit(DESIGNER.DOUBLE_CLICK, null)
            }
        }
    },
    data () {
        return {
            children: [] as DragPayload[]
        }
    },
    mounted () {
        initDecorator()
    },
    methods: {
        onDrop () {
            this.$store.commit(DRAG.END)
            this.addChild(this.dragPayload)
        },
        addChild (child: DragPayload) {
            this.children.push(Object.assign({}, child, {
                _id: Date.now()
            }))
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
