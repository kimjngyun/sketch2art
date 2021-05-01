/*
 * image: {
 *   original: <Image>,
 *   style: <Number>,
 *   processed: <Image>
 * }
 */
const getDefaultState = () => {
    return {
        images: []
    }
}

const state = getDefaultState()

const getters = {
    getImages: state => state.images
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
            processed: null
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