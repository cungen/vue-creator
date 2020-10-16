import { DESIGNER } from '../types'
import { PropType, Component } from 'vue'

const allState = {
    activeComponent: null as null | PropType<Component>,
    activeProps: [] as Array<Prop>
}

export default {
    state: allState,
    getters: {
        activeComponent: (state: typeof allState) => state.activeComponent,
        activeProps: (state: typeof allState) => state.activeProps
    },
    mutations: {
        [DESIGNER.ACTIVATE] (state: typeof allState, payload: PropType<Component>) {
            state.activeComponent = payload
        },
        [DESIGNER.PROP_CHANGE] (state: typeof allState, payload: Array<Prop>) {
            state.activeProps = payload
        }
    }
}
