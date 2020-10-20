import Vue, { VNode } from 'vue'
import DragWrapperOpts from '../components/drag-wrapper-opts.vue'

class DragWrapperModel {
    el: HTMLElement
    vnode: VNode
    comp: Vue
    hasAppend: boolean

    constructor (el: HTMLElement, vnode: VNode) {
        this.el = el
        this.vnode = vnode
        this.comp = new Vue(DragWrapperOpts)
        this.comp.$mount()
        this.hasAppend = false
        this.bindEvent()

        const pos = window.getComputedStyle(el).position
        if (pos !== 'absolute' && pos !== 'fixed') {
            el.style.position = 'relative'
        }
    }

    bindEvent () {
        this.comp.$on('delete', () => {
            if (this.vnode.context) {
                this.vnode.context.$emit('delete')
            }
        })
    }

    onMouseEnter = (e: Event) => {
        if (!this.hasAppend && this.comp?.$el) {
            this.el.appendChild(this.comp.$el)
            this.hasAppend = true
        }
        this.comp.$props.show = true
        e.stopPropagation()
    }

    onMouseLeave = (e: MouseEvent) => {
        if (this.comp) {
            if (!this.comp.$el.contains(e.relatedTarget as Node)) {
                this.comp.$props.show = false
            }
        }
        e.stopPropagation()
    }
}

interface DragEl extends HTMLElement {
    __dragWrapper?: DragWrapperModel;
}

export default Vue.directive('drag-wrapper', {
    bind (el: DragEl, binding, vnode: VNode) {
        const model = new DragWrapperModel(el, vnode)

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
            const model = el.__dragWrapper as DragWrapperModel
            el.removeEventListener('mouseover', model.onMouseEnter)
            el.removeEventListener('mouseout', model.onMouseLeave)
        }
    }
})
