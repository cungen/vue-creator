<template lang="pug">
a-collapse.packages(:bordered='false')
    a-collapse-panel(v-for='p in packages' :key="p.name" :header="p.name")
        drag.c-item(v-for='c in p.children' :key='c.name' @dragstart='onDragStart' @dragend='onDragEnd' :transferData='c') {{c.name}}
</template>
<script lang="ts">
import Vue from 'vue'
import * as AntComponents from 'ant-design-vue'
import { Drag } from 'vue-drag-drop'
import { DRAG } from '../../../store/types'

function getAntPackage () {
    const ants = []
    for (const i in AntComponents) {
        const c = AntComponents[i as keyof typeof AntComponents]
        if (c && Object.hasOwnProperty.call(c, 'name') && Object.hasOwnProperty.call(c, 'install')) {
            ants.push(c)
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
        children: []
    }
}

export default Vue.extend({
    components: {
        Drag
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

</style>
