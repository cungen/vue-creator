<template lang="pug">
.drop-area(
    tabindex='0'
    :class='{active: active, dragging: dragging}'
    v-drop="{drop: onDrop, dragEnter: () => active = true, dragLeave: () => active = false}"
) {{placeholder || 'drop area'}}
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Drop } from '../directives/drag-drop'

function guid (): string {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()
}

export default Vue.extend({
    props: {
        placeholder: String
    },
    data () {
        return {
            id: '' as string,
            active: false
        }
    },
    computed: {
        ...mapGetters([
            'dragging'
        ])
    },
    directives: {
        drop: Drop
    },
    mounted () {
        this.id = guid()
    },
    methods: {
        onDrop () {
            this.active = false
            this.$emit('drop')
        }
    }
})
</script>

<style lang="sass" scoped>
$red: #f81d22
$green: #42b983

.drop-area
    border-radius: 2px
    overflow: hidden
    color: #999
    text-align: center
    border: 1px dotted rgba($green, 0.8)
    &:focus
        border: 1px dotted rgba($red, 0.8)
        outline: 0
    &.dragging
        background: rgba($green, 0.1)
    &.active
        border: 1px dotted rgba($red, 0.8)
        background: rgba($red, 0.1)

</style>
