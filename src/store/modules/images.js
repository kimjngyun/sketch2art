/*
 * image: {
 *   original: <Image>,
 *   style: <Number>,
 *   processed: <Image>
 * }
 */
const getDefaultState = () => {
    return {
        images: [],
        processed: false
    }
}

const state = getDefaultState()

const getters = {
    getImages: state => state.images,
    getProcessed: state => state.processed,
}

const mutations = {
    addNewImage (state, newImage) {
        state.images.push(newImage)
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    }
}

const actions = {
    addNewImage({ commit }, newImage) {
        commit('addNewImage', {
            original: newImage,
            style: 0,
            processed: true
        })
    },
    resetImage({ commit }) {
        commit('resetState')
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}