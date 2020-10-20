<template lang="pug">
.component-props
    .c-name(v-if='activeComponent') {{activeComponent.$options._componentTag}}
    template(v-for='prop in props')
        .prop-item
            .p-name {{prop.name}}
                span.required(v-if='prop.required') *
                span.p-info(v-if='typeof prop.default !== "undefined"') ({{prop.default}})
            a-row(v-if='prop.type')
                a-col.p-label(:span='6') 类型：
                a-col(:span='18')
                    template(v-if='isArray(prop.type)')
                        span.value {{prop.type.map(t => t.name).join(',')}}
                    template(v-else)
                        span.value {{prop.type.name}}
            a-row.p-form
                a-col.p-label(:span='6') 内容：
                a-col(:span='18')
                    template(v-if='prop.showType === "string"')
                        a-input(size='small' v-model='prop.value' @change='onPropChange(prop)')
                    template(v-else-if='prop.showType === "number"')
                        a-input-number.input-number(size='small' v-model='prop.value' @change='onPropChange(prop)')
                    template(v-else-if='prop.showType === "boolean"')
                        a-switch(size="small" default-checked v-model='prop.value' @change='onPropChange(prop)')
                    template(v-else)
                        a-input(size='small' type='textarea' v-model='prop.value' @change='onPropChange(prop)')
            a-row.p-form(v-if='prop.hasError')
                a-col.p-label(:span='6')
                a-col(:span='18')
                    .p-warning
                        a-icon(type='info-circle')
                        | 请参考组件文档书写
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import safeEval from 'safe-eval'
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
        isArray (val) {
            return Array.isArray(val)
        },
        isObject (val) {
            return ({}).toString.call(val) === '[object Object]'
        },
        isFunction (val) {
            return ({}).toString.call(val) === '[object Function]'
        },
        update () {
            const allProps = _.get(this.activeComponent, 'constructor.options.props') || {}
            const preValues = this.activeComponent.$props
            this.props = []

            Object.keys(allProps).forEach(k => {
                const prop = allProps[k]
                const val = Object.hasOwnProperty.call(preValues, k) ? preValues[k] : undefined
                const showType = this.getShowType(prop.type)
                this.props.push({
                    ...prop,
                    showType: showType,
                    key: k,
                    name: k,
                    value: this.isFunction(val) ? (showType === 'textarea' ? val.toString() : val()) : ((this.isObject(val) || this.isArray(val)) && showType === 'textarea' ? JSON.stringify(val) : val),
                    hasError: Boolean(allProps[k].validator && val !== undefined && !allProps[k].validator(val))
                })
            })
            console.log(this.props)
        },
        getShowType (type) {
            if (this.isArray(type)) {
                if (type.some(t => t.name === 'String')) {
                    return 'string'
                } else if (type.some(t => t.name === 'Number')) {
                    return 'number'
                } else if (type.some(t => t.name === 'Boolean')) {
                    return 'boolean'
                } else {
                    return 'textarea'
                }
            } else if (type) {
                if (['Array', 'Object', 'Function'].indexOf(type.name) !== -1) {
                    return 'textarea'
                } else {
                    return type.name.toLowerCase()
                }
            }
            return 'textarea'
        },
        validate (prop) {
            return !prop.validator || prop.validator(prop.value)
        },
        adaptValue (prop) {
            if (prop.showType === 'textarea' && prop.value) {
                if (prop.type.name === 'Object' || prop.type.name === 'Array') {
                    try {
                        return JSON.parse(prop.value)
                    } catch (e) {
                        return prop.type.name === 'Object' ? {} : []
                    }
                } else if (prop.type.name === 'Function') {
                    return safeEval(prop.value)
                }
            }
            return prop.value
        },
        onPropChange (prop) {
            prop.hasError = !this.validate(prop)
            const rs = this.props.map(p => {
                return {
                    ...p,
                    value: p
                }
            }).filter(p => {
                return !p.hasError && [null, '', undefined].indexOf(p.value) === -1
            })
            console.log('commit prop', rs)

            this.$store.commit(DESIGNER.PROP_CHANGE, rs)
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

.c-name
    font-size: 16px
    font-weight: 600
    margin-bottom: 8px

.p-name
    font-weight: 600
.p-info
    font-weight: normal
    color: #999
    margin-left: 8px
    font-size: 0.85em
.p-warning
    font-weight: normal
    color: #999
    font-size: 0.85em
    color: #faad14
    i
        margin-right: 4px

.p-label
    font-weight: 500
    font-size: 0.8em
    color: #999
.input-number
    width: 100%

</style>
