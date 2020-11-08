<template lang="pug">
a-collapse.packages(:bordered='false' expand-icon-position="right")
    a-collapse-panel(v-for='p in packages' :key="p.name" :header="p.name")
        template(v-for='c in p.children')
            .c-section(v-if='c.children && c.children.length')
                .c-section-name # {{c.name}}
                .c-item(
                    v-for='sub in c.children'
                    :key='sub.name'
                    v-drag='{ dragStart: onDragStart, dragEnd: onDragEnd, transferData: sub }'
                    @dblclick='handleDblClick(sub)'
                ) {{sub.name}}

            .c-item(
                v-else
                v-drag='{ dragStart: onDragStart, dragEnd: onDragEnd, transferData: c }'
                @dblclick='handleDblClick(c)'
            ) {{c.name}}
</template>
<script lang="ts">
import Vue from 'vue'
import * as AntComponents from 'ant-design-vue'
// import * as ElementComponents from 'element-ui'
// import * as Vuetify from 'vuetify/es5/components/index'
import { DRAG, DESIGNER } from '../../../../store/types'
import { Drag } from '../../directives/drag-drop'
import AntPackages from './packages-ant'

Vue.component('CgText', {
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
    render (h) {
        return h(this.tag, this.text || 'text placeholder')
    }
})

/*
function getElementPackage () {
    const list = []
    for (const i in ElementComponents) {
        const c = ElementComponents[i as keyof typeof ElementComponents]
        if (c && Object.hasOwnProperty.call(c, 'name') && Object.hasOwnProperty.call(c, 'install')) {
            list.push(c)
            if (typeof c !== 'string') {
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
    }
    return {
        name: 'Element UI',
        children: list
    }
}

function getVuetifyPackage () {
    const list = []
    for (const i in Vuetify) {
        // eslint-disable-next-line
        const c = (Vuetify[i] as any).extendOptions
        if (c && Object.hasOwnProperty.call(c, 'name') && Object.hasOwnProperty.call(c, 'render')) {
            list.push(c)
        }
    }
    return {
        name: 'Vuetify',
        children: list
    }
}
*/

function getLayoutPackage () {
    return {
        name: 'Layout',
        children: [
            {
                name: AntComponents.Row.name,
                defaultProps: {
                    gutter: 10
                }
            },
            {
                name: AntComponents.Col.name,
                defaultProps: {
                    span: 12
                }
            },
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
            // getVuetifyPackage(),
            // getElementPackage(),
            AntPackages,
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
        },
        handleDblClick (payload: DragPayload) {
            this.$store.commit(DESIGNER.DOUBLE_CLICK, Object.assign({}, payload))
        }
    }
})
</script>
<style lang="sass" scoped>
.packages
    &::v-deep
        .ant-collapse-content-box
            padding-bottom: 8px
.c-item
    display: inline-block
    height: 24px
    line-height: 24px
    border: 1px solid #e4e4e4
    background: #fff
    border-radius: 4px
    padding: 0 6px
    margin-right: 6px
    margin-bottom: 6px
    cursor: move

.c-section-name
    color: #999
    font-style: italic
    margin-bottom: 8px
    font-size: 1.1em

</style>
