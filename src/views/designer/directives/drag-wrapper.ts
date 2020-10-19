import Vue, { VNode } from 'vue'

class DragWrapperModel {
    el: HTMLElement
    context: Vue|undefined

    constructor (el: HTMLElement, vnode: VNode) {
        this.el = el
        this.context = vnode.context
    }

    onMouseEnter () {
        const ele = this.el.querySelector('.drag-wrapper__opts')
        if (!ele) {
            const fragment = document.createDocumentFragment()
            const div = document.createElement('div')
            div.className = 'drag-wrapper__opts'
            div.innerText = 'test'
            fragment.append(div)
            this.el.appendChild(fragment)
        } else {
            ele.setAttribute('style', 'display: block')
        }
    }

    onMouseLeave () {
        const ele = this.el.querySelector('.drag-wrapper__opts')
        if (ele) {
            ele.setAttribute('style', 'block')
            ele.setAttribute('style', 'display: none')
        }
    }
}

interface DragEl extends HTMLElement {
    __dragWrapper?: DragWrapperModel;
}

export default Vue.directive('drag-wrapper', {
    bind (el: DragEl, binding, vnode: VNode) {
        const model = new DragWrapperModel(el, vnode)

        if (!Object.prototype.hasOwnProperty.call(el, '__drag_wrapper')) {
            Object.assign(el, {
                __dragWrapper: model
            })
        }

        el.addEventListener('mouseenter', model.onMouseEnter.bind(model))
        el.addEventListener('mouseleave', model.onMouseLeave.bind(model))
    },
    unbind (el: DragEl) {
        if (Object.prototype.hasOwnProperty.call(el, '__drag_wrapper')) {
            const model = el.__dragWrapper as DragWrapperModel
            // todo 测试是否真的销毁了
            el.removeEventListener('mouseenter', model.onMouseEnter)
            el.removeEventListener('mouseleave', model.onMouseLeave)
        }
    },
    inserted (el) {
        console.log('inserted', el)
    }
})
