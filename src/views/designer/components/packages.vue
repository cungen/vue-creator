<template lang="pug">
a-collapse.packages(:bordered='false')
    a-collapse-panel(v-for='p in packages' :key="p.name" :header="p.name")
        template(v-for='c in p.children')
            .c-item(
                v-drag='{ dragStart: onDragStart, dragEnd: onDragEnd, transferData: c }'
            ) {{c.name}}
            .c-item-children(v-if='c.children && c.children.length')
                .c-item(
                    v-for='sub in c.children'
                    :key='sub.name'
                    v-drag='{ dragStart: onDragStart, dragEnd: onDragEnd, transferData: sub }'
                ) {{sub.name}}
</template>
<script lang="ts">
import Vue from 'vue'
import * as AntComponents from 'ant-design-vue'
import { DRAG } from '../../../store/types'
import { Drag } from '../directives/drag-drop'

Vue.component('CgText', {
    name: 'CgText',
    props: {
        text: {
            type: String
        }
    },
    render (h) {
        return h('span', this.text || this.$slots.default)
    }
})

function getAntPackage () {
    const ants = []
    for (const i in AntComponents) {
        const c = AntComponents[i as keyof typeof AntComponents]
        if (c && Object.hasOwnProperty.call(c, 'name') && Object.hasOwnProperty.call(c, 'install')) {
            ants.push(c)
            const children = [] as Array<typeof c>
            for (const key in c) {
                const sub = c[key as keyof typeof c]
                if (Object.hasOwnProperty.call(sub, 'render') && Object.hasOwnProperty.call(sub, 'name')) {
                    children.push(sub)
                }
            }
            Object.assign(c, { children: children })
        }
    }
    return {
        name: 'Ant Design',
        children: ants
    }
}

function getLayoutPackage () {
    return {
        name: 'Layout',
        children: [
            AntComponents.Row,
            AntComponents.Col,
            AntComponents.Divider,
            AntComponents.Layout
        ]
    }
}

function getOtherPackage () {
    return {
        name: 'Others',
        children: [
            { name: 'CgText' }
        ]
    }
}

export default Vue.extend({
    directives: {
        drag: Drag
    },
    data () {
        const packages = [
            getLayoutPackage(),
            getAntPackage(),
            getOtherPackage()
        ]

        return {
            packages
        }
    },
    methods: {
        onDragStart (payload: DragPayload) {
            this.$store.commit(DRAG.START, {
                ...payload,
                type: 'new'
            })
        },
        onDragEnd () {
            this.$store.commit(DRAG.END)
        }
    }
})
</script>
<style lang="sass" scoped>
.c-item
    display: inline-block
    height: 28px
    line-height: 28px
    border: 1px solid #e4e4e4
    background: #fff
    border-radius: 4px
    padding: 0 6px
    margin-right: 6px
    margin-bottom: 6px
    cursor: move

.c-item-children
    border: 1px dashed #ddd
    border-radius: 2px
    padding: 6px 6px 0
    margin-bottom: 6px
    font-size: 0.85em
    .c-item
        height: 24px
        line-height: 24px
</style>
