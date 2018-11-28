const initialState = {
    path: null,
    files: null,
    folders: null,
    action: null,
    args: [],
    // backup: []
};
let state = {
    ...initialState
};
const clearState = () => state = { ...initialState };

module.exports = { state, clearState };
