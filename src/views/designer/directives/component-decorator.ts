import Vue from 'vue'
import { VNode } from 'vue/types/umd'
import ComponentDecorator from '../components/component-decorator.vue'

let decorator = null as null|Vue
let initialized = false
let lastClickNode = null as null | VNode

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
                relatedNode: this.vnode
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
            lastClickNode = this.vnode
            Object.assign(decorator.$props, {
                clickNode: this.vnode
            })
        }
    }
}

const MODEL_DATA_ATTR = '__dragWrapper'

interface DecoratorEl extends HTMLElement {
    [MODEL_DATA_ATTR]?: ComponentModel;
}

export default Vue.directive('component-decorator', {
    bind (el: DecoratorEl, binding, vnode: VNode) {
        const model = new ComponentModel(vnode)

        if (!Object.hasOwnProperty.call(el, MODEL_DATA_ATTR)) {
            Object.assign(el, {
                [MODEL_DATA_ATTR]: model
            })
        }

        el.addEventListener('mouseover', model.onMouseEnter)
        el.addEventListener('mouseout', model.onMouseLeave)
        el.addEventListener('click', model.onClick)
    },
    unbind (el: DecoratorEl) {
        if (Object.hasOwnProperty.call(el, MODEL_DATA_ATTR)) {
            const model = el[MODEL_DATA_ATTR] as ComponentModel
            el.removeEventListener('mouseover', model.onMouseEnter)
            el.removeEventListener('mouseout', model.onMouseLeave)
            el.removeEventListener('click', model.onClick)

            // clear click Node
            if (lastClickNode === model.vnode && decorator) {
                Object.assign(decorator.$props, {
                    clickNode: null
                })
            }
        }
    }
})
