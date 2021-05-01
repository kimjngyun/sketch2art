const state = {
    // styleTransferServer: 'http://172.27.186.47:4000'
    styleTransferServer: 'http://172.27.186.221:4000'
    // styleTransferServer: 'http://172.27.186.223:4001'
}

const getters = {
    urlOf: state => server => state[server]
}

const mutations = {
}

const actions = {
}

export default {
    state,
    getters,
    mutations,
    actions
}
