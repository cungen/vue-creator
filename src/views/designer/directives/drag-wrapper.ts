import Vue from 'vue'

export default Vue.directive('drag-wrapper', {
    bind (el) {
        const model = {}

        if (!Object.prototype.hasOwnProperty.call(el, '__drag_wrapper')) {
            Object.assign(el, {
                __dragWrapper: model
            })
        }
    },
    unbind (el) {
        console.log('unbind', el)
    },
    inserted (el) {
        console.log('inserted', el)
    }
})
