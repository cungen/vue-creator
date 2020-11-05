<script lang="ts">
import Vue, { VNode } from 'vue'
import { mapGetters } from 'vuex'
import { Drop } from '../directives/drag-drop'

export default Vue.extend({
    props: {
        placeholder: String,
        tag: {
            type: String,
            default: 'div'
        }
    },
    data () {
        return {
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
    methods: {
        onDrop () {
            this.active = false
            this.$emit('drop')
        }
    },
    render (h): VNode {
        return h(this.tag, {
            attrs: {
                tabindex: '0'
            },
            class: {
                'drop-area': true,
                active: this.active,
                dragging: this.dragging
            },
            directives: [{
                name: 'drop',
                value: {
                    drop: this.onDrop,
                    dragEnter: () => {
                        this.active = true
                    },
                    dragLeave: () => {
                        this.active = false
                    }
                }
            }]
        }, [this.placeholder || 'drop area'])
    }
})
</script>

<style lang="sass" scoped>
$red: #f81d22
$green: #42b983

.drop-area
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
