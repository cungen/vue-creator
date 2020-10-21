import Vue from 'vue'

interface DragEl extends HTMLElement {
    __dragData?: {
        dragStart: EventListener;
        dragEnd: EventListener;
        drop: EventListener;
        transferData?: DragPayload;
    };
}

interface DropEl extends HTMLElement {
    __dropData?: {
        drop: EventListener;
        dragEnter: EventListener;
        dragLeave: EventListener;
        dragOver: EventListener;
    };
}

export const Drag = Vue.directive('drag', {
    bind (el: DragEl, binding) {
        el.setAttribute('draggable', 'true')

        const data = {
            dragStart () {
                if (binding.value.dragStart) {
                    binding.value.dragStart(binding.value.transferData)
                }
            },
            dragEnd () {
                if (binding.value.dragEnd) {
                    binding.value.dragEnd(binding.value.transferData)
                }
            },
            drop () {
                console.log('test')
            }
        }

        Object.assign(el, {
            __dragData: data
        })

        el.addEventListener('dragstart', data.dragStart)
        el.addEventListener('dragend', data.dragEnd)
        el.addEventListener('drop', data.drop)
    },
    unbind (el: DragEl) {
        el.removeAttribute('draggable')
        if (el.__dragData) {
            const data = el.__dragData

            el.removeEventListener('dragstart', data.dragStart)
            el.removeEventListener('dragend', data.dragEnd)
            el.removeEventListener('drop', data.drop)
        }
    }
})

export const Drop = Vue.directive('drop', {
    bind (el: DropEl, binding) {
        const data = {
            drop (e: DragEvent) {
                if (binding.value.drop) {
                    binding.value.drop()
                }
                e.preventDefault()
            },
            dragEnter (e: DragEvent) {
                if (binding.value.dragEnter) {
                    binding.value.dragEnter()
                }
                e.preventDefault()
            },
            dragLeave () {
                if (binding.value.dragLeave) {
                    binding.value.dragLeave()
                }
            },
            dragOver (e: DragEvent) {
                if (binding.value.dragOver) {
                    binding.value.dragOver()
                }
                e.preventDefault()
            }
        }

        Object.assign(el, {
            __dropData: data
        })

        el.addEventListener('drop', data.drop)
        el.addEventListener('dragenter', data.dragEnter)
        el.addEventListener('dragleave', data.dragLeave)
        el.addEventListener('dragover', data.dragOver)
    },
    unbind (el: DropEl) {
        if (el.__dropData) {
            const data = el.__dropData

            el.removeEventListener('drop', data.drop)
            el.removeEventListener('dragenter', data.dragEnter)
            el.removeEventListener('dragleave', data.dragLeave)
            el.removeEventListener('dragover', data.dragOver)
        }
    }
})
