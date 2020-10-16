import { DRAG } from '../types'

const allState = {
    dragging: false,
    dragPayload: {} as DragPayload
}
export default {
    state: allState,
    getters: {
        dragging: (state: typeof allState) => state.dragging,
        dragPayload: (state: typeof allState) => state.dragPayload
    },
    mutations: {
        [DRAG.START] (state: typeof allState, payload: DragPayload) {
            state.dragPayload = payload
            state.dragging = true
        },
        [DRAG.END] (state: typeof allState) {
            state.dragging = false
        }
    }
}
