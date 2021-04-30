/*
 * image: {
 *   original: <Image>,
 *   style: <Number>,
 *   processed: <Image>
 * }
 */
const state = {
    images: []
}

const getters = {
    getImages: state => state.images
}

const mutations = {
    addNewImage (state, newImage) {
        state.images.push(newImage)
    }
}

const actions = {
    addNewImage({ commit }, newImage) {
        commit('addNewImage', {
            original: newImage,
            style: 0,
            processed: null
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}