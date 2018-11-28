const initialState = {
    path: null,
    files: null,
    folders: null,
    action: null,
    args: [],
    backup: {
        files: [],
        folders: []
    }
};
const copyInitialState = () => ({
    ...initialState,
    backup: {
        ...initialState.backup
    }
});

let state = copyInitialState();

const clearState = () => state = copyInitialState();
const getState = () => state;

module.exports = { getState, clearState };
