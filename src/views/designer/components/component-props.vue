<template lang="pug">
.component-props
    template(v-for='prop in props')
        .prop-item
            .p-name {{prop.name}}
            a-row(v-if='prop.type')
                a-col.p-label(:span='6') 类型：
                a-col(:span='18')
                    template(v-if='isArray(prop.type)')
                        span.value {{prop.type.map(t => t.name).join(',')}}
                    template(v-else)
                        span.value {{prop.type.constructor.name}}
            a-row.p-form
                a-col.p-label(:span='6') 内容：
                a-col(:span='18')
                    template(v-if='hasInput(prop.type)')
                        a-input(size='small' v-model='prop.value' @change='onPropChange')
                    template(v-else-if='hasNumber(prop.type)')
                        a-input-number.input-number(size='small' v-model='prop.value' @change='onPropChange')
                    template(v-else)
                        a-input(size='small' type='textarea' v-model='prop.value' @change='onPropChange')
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { DESIGNER } from '../../../store/types'

export default Vue.extend({
    data () {
        return {
            props: []
        }
    },
    computed: {
        ...mapGetters([
            'activeComponent'
        ])
    },
    watch: {
        activeComponent (now, old) {
            if (now !== old) {
                this.update()
            }
        }
    },
    methods: {
        update () {
            const props = _.get(this.activeComponent, 'constructor.options.props') || {}
            this.props = []

            Object.keys(props).forEach(k => {
                this.props.push({
                    ...props[k],
                    key: k,
                    name: k[0].toUpperCase() + k.substr(1),
                    value: null
                })
            })
        },
        isArray (val) {
            return Array.isArray(val)
        },
        hasInput (val) {
            if (this.isArray(val)) {
                return val.some(t => t.name === 'String')
            } else if (val) {
                return val.constructor.name === 'String'
            }
            return true
        },
        hasNumber (val) {
            if (this.isArray(val)) {
                return val.some(t => t.name === 'Number')
            } else if (val) {
                return val.constructor.name === 'Number'
            }
            return false
        },
        onPropChange () {
            this.$store.commit(DESIGNER.PROP_CHANGE, this.props)
        }
    }
})
</script>
<style lang="sass" scoped>
.component-props
    padding: 8px

.prop-item
    position: relative
    padding-bottom: 4px
    margin-bottom: 4px
    line-height: 24px
    &:after
        content: ''
        position: absolute
        left: 0
        right: 0
        bottom: 0
        height: 1px
        background: #e0e0e0
    &:last-of-type:after
        display: none

.p-name
    font-weight: 600

.p-label
    font-weight: 500
    font-size: 0.8em
    color: #999
.input-number
    width: 100%

</style>
