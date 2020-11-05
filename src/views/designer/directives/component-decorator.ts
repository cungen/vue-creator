import Vue from 'vue'
import { VNode } from 'vue/types/umd'
import ComponentDecorator from '../components/component-decorator.vue'

let decorator = null as null|Vue
let initialized = false

class ComponentModel {
    vnode: VNode

    constructor (vnode: VNode) {
        this.vnode = vnode
        this.init()
    }

    init () {
        if (!initialized) {
            initialized = true
            let ele = document.querySelector('.component-decorator')
            if (!ele) {
                ele = document.createElement('div')
                document.body.appendChild(ele)
            }
            decorator = new Vue(ComponentDecorator)
            decorator.$mount(ele)
        }
    }

    onMouseEnter = (e: MouseEvent) => {
        if (decorator) {
            Object.assign(decorator.$props, {
                relatedNode: this.vnode.context
            })
        }
        e.stopPropagation()
    }

    onMouseLeave = (e: MouseEvent) => {
        if (decorator) {
            decorator.$emit('hide')
        }
        e.stopPropagation()
    }

    onClick = () => {
        if (decorator) {
            Object.assign(decorator.$props, {
                clickNode: this.vnode.context
            })
        }
    }
}

interface DragEl extends HTMLElement {
    __dragWrapper?: ComponentModel;
}

export default Vue.directive('component-decorator', {
    bind (el: DragEl, binding, vnode: VNode) {
        const model = new ComponentModel(vnode)

        if (!Object.hasOwnProperty.call(el, '__drag_wrapper')) {
            Object.assign(el, {
                __dragWrapper: model
            })
        }

        el.addEventListener('mouseover', model.onMouseEnter)
        el.addEventListener('mouseout', model.onMouseLeave)
        el.addEventListener('click', model.onClick)
    },
    unbind (el: DragEl) {
        if (Object.hasOwnProperty.call(el, '__drag_wrapper')) {
            const model = el.__dragWrapper as ComponentModel
            el.removeEventListener('mouseover', model.onMouseEnter)
            el.removeEventListener('mouseout', model.onMouseLeave)
            el.removeEventListener('click', model.onClick)
        }
    }
})
