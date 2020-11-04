import Vue from 'vue'
import ComponentDecorator from '../components/component-decorator.vue'

let decorator = null as null|Vue
let initialized = false

class ComponentModel {
    el: HTMLElement

    constructor (el: HTMLElement) {
        this.el = el
        this.init()

        const pos = window.getComputedStyle(el).position
        if (pos !== 'absolute' && pos !== 'fixed') {
            el.style.position = 'relative'
        }
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
        const target = e.target as HTMLElement
        const comEle = target.closest('.component-wrapper')
        if (comEle && decorator) {
            Object.assign(decorator.$props, {
                relatedEle: comEle
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
}

interface DragEl extends HTMLElement {
    __dragWrapper?: ComponentModel;
}

export default Vue.directive('component-decorator', {
    bind (el: DragEl) {
        const model = new ComponentModel(el)

        if (!Object.hasOwnProperty.call(el, '__drag_wrapper')) {
            Object.assign(el, {
                __dragWrapper: model
            })
        }

        el.addEventListener('mouseover', model.onMouseEnter)
        el.addEventListener('mouseout', model.onMouseLeave)
    },
    unbind (el: DragEl) {
        if (Object.hasOwnProperty.call(el, '__drag_wrapper')) {
            const model = el.__dragWrapper as ComponentModel
            el.removeEventListener('mouseover', model.onMouseEnter)
            el.removeEventListener('mouseout', model.onMouseLeave)
        }
    }
})
