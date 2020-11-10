import Vue from 'vue'
import { VNode } from 'vue/types/umd'
import ComponentDecorator from '../components/component-decorator.vue'

let decorator = null as null|Vue
let initialized = false
let lastClickNode = null as null | VNode

class ComponentModel {
    vnode: VNode
    slots: Array<string>
    onDrop: Function

    constructor (vnode: VNode, slots: Array<string>, onDrop: Function) {
        this.vnode = vnode
        this.slots = slots
        this.onDrop = onDrop
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
            decorator = new Vue(Object.assign(ComponentDecorator))
            decorator.$mount(ele)
        }
    }

    onMouseEnter = (e: MouseEvent) => {
        if (decorator) {
            Object.assign(decorator.$props, {
                dragging: false,
                relatedNode: { ...this.vnode }
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

    dragEnter = () => {
        if (this.slots.length) {
            Object.assign(decorator?.$props, {
                dragging: true,
                slots: this.slots,
                relatedNode: { ...this.vnode },
                onDrop: this.onDrop
            })
        }
    }

    dragLeave = () => {
        if (decorator) {
            decorator.$emit('hide')
        }
    }
}

const MODEL_DATA_ATTR = '__dragWrapper'

interface DecoratorEl extends HTMLElement {
    [MODEL_DATA_ATTR]?: ComponentModel;
}

export default Vue.directive('component-decorator', {
    bind (el: DecoratorEl, binding, vnode: VNode) {
        const model = new ComponentModel(vnode, binding.value.slots || [], binding.value.onDrop)

        if (!Object.hasOwnProperty.call(el, MODEL_DATA_ATTR)) {
            Object.assign(el, {
                [MODEL_DATA_ATTR]: model
            })
        }

        el.addEventListener('mouseover', model.onMouseEnter)
        el.addEventListener('mouseout', model.onMouseLeave)
        el.addEventListener('click', model.onClick)
        el.addEventListener('dragenter', model.dragEnter)
        el.addEventListener('dragleave', model.dragLeave)
    },
    update (el: DecoratorEl, binding) {
        if (Object.hasOwnProperty.call(el, MODEL_DATA_ATTR)) {
            const model = el[MODEL_DATA_ATTR] as ComponentModel
            model.slots = binding.value.slots || []
        }
    },
    unbind (el: DecoratorEl) {
        if (Object.hasOwnProperty.call(el, MODEL_DATA_ATTR)) {
            const model = el[MODEL_DATA_ATTR] as ComponentModel
            el.removeEventListener('mouseover', model.onMouseEnter)
            el.removeEventListener('mouseout', model.onMouseLeave)
            el.removeEventListener('click', model.onClick)
            el.removeEventListener('dragenter', model.dragEnter)
            el.removeEventListener('dragleave', model.dragLeave)

            // clear click Node
            if (lastClickNode === model.vnode && decorator) {
                Object.assign(decorator.$props, {
                    clickNode: null
                })
            }
        }
    }
})
