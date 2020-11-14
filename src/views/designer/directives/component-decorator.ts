import Vue from 'vue'
import ComponentDecorator from '../components/component-decorator.vue'
import _ from 'lodash'

interface ComponentItem extends Vue {
    slots: string[];
}

interface VueHtmlElement extends HTMLElement {
    __vue__: Vue;
    _cgContext: ComponentItem;
}

let decoratorModel = null as null|DecoratorModel

class DecoratorModel {
    decorator: Vue
    domClass = '.component-decorator'
    marker = '.component-wrapper'

    constructor () {
        this.decorator = new Vue()
        this.initComponent()
        this.initEvents()
    }

    initComponent () {
        let ele = document.querySelector(this.domClass)
        if (!ele) {
            ele = document.createElement('div')
            document.body.appendChild(ele)
        }
        this.decorator = new Vue(ComponentDecorator)
        this.decorator.$mount(ele)
    }

    initEvents () {
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('dragover', this.onDragOver)
    }

    getNodeContext (ele: EventTarget|null): ComponentItem|null {
        if (ele) {
            const wrapper = (ele as HTMLElement).closest(this.marker) as VueHtmlElement
            return wrapper?._cgContext
        }
        return null
    }

    onMouseMove = _.throttle((e: MouseEvent) => {
        const node = this.getNodeContext(e.target)
        if (node) {
            Object.assign(this.decorator.$props, {
                dragging: false,
                relatedNode: node
            })
        } else {
            this.decorator.$emit('hide')
        }
    }, 300, { trailing: true })

    onDragOver = (e: DragEvent) => {
        const node = this.getNodeContext(e.target)
        if (node && node.slots.length) {
            Object.assign(this.decorator.$props, {
                dragging: true,
                relatedNode: node
            })
        } else {
            this.decorator.$emit('hide')
        }
        e.preventDefault()
    }
}

export function initDecorator () {
    if (decoratorModel) {
        return
    }
    decoratorModel = new DecoratorModel()
}
