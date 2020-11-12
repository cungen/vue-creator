import { DESIGNER } from '../types'
import { PropType, Component } from 'vue'

const allState = {
    activeComponent: null as null | PropType<Component>,
    activeProps: [] as Array<Prop>,
    activeDbl: null as null | DragPayload,
    focusDrop: null as null | Vue
}

export default {
    state: allState,
    getters: {
        activeComponent: (state: typeof allState) => state.activeComponent,
        activeProps: (state: typeof allState) => state.activeProps,
        activeDbl: (state: typeof allState) => state.activeDbl,
        focusDrop: (state: typeof allState) => state.focusDrop
    },
    mutations: {
        [DESIGNER.ACTIVATE] (state: typeof allState, payload: PropType<Component>) {
            state.activeComponent = payload
        },
        [DESIGNER.PROP_CHANGE] (state: typeof allState, payload: Array<Prop>) {
            state.activeProps = payload
        },
        [DESIGNER.DOUBLE_CLICK] (state: typeof allState, payload: DragPayload|null) {
            state.activeDbl = payload
        },
        [DESIGNER.FOCUS] (state: typeof allState, payload: Vue) {
            state.focusDrop = payload
        }
    }
}
