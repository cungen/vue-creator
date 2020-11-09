<script lang="ts">
import Vue, { VNode } from 'vue'

export default Vue.extend({
    name: 'CgText',
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        text: {
            type: String
        }
    },
    data () {
        return {
            realTag: this.tag
        }
    },
    render (h): VNode {
        return h(this.realTag, this.text || 'text placeholder')
    },
    mounted () {
        if (this.$el.parentElement?.nodeName?.toLowerCase() === 'span' && this.realTag === 'div') {
            this.realTag = 'span'
        }
    }
})
</script>
