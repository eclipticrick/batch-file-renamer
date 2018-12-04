const is = require('./is');

const stateTypes = {
    path: (x) => is.stringOrNull(x, 'path'),
    files: (x) => is.booleanOrNull(x, 'files'),
    folders: (x) => is.booleanOrNull(x, 'folders'),
    action: (x) => is.stringOrNull(x, 'action'),
    args: (x) => is.array(x, 'args'),
    backup: (x) => is.object(x, 'backup')
};
const backupTypes = {
    files: (x) => is.array(x, 'files'),
    folders: (x) => is.array(x, 'folders')
};
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
    args: [...initialState.args],
    backup: {
        files: [...initialState.backup.files],
        folders: [...initialState.backup.folders]
    }
});
let state = copyInitialState();

const clearState = () => state = copyInitialState();
const getState = () => state;
const validateNewStateStructure = (stateOverwrites) => {
    Object.keys(stateOverwrites).forEach(key => {
        if (!Object.keys(initialState).includes(key)){
            throw new Error(`'${key}' is not a valid state param!`)
        }
        stateTypes[key](stateOverwrites[key]);
        if (key === 'backup') {
            Object.keys(stateOverwrites.backup).forEach(k => {
                if (!Object.keys(initialState.backup).includes(k)){
                    throw new Error(`'backup.${k}' is not a valid state param!`)
                }
                backupTypes[k](stateOverwrites.backup[k]);
            })
        }
    });
};
const setState = (stateOverwrites) => {
    validateNewStateStructure(stateOverwrites);
    state = {
        ...state,
        ...stateOverwrites,
        backup: {
            ...state.backup,
            ...stateOverwrites.backup
        }
    }
};

module.exports = { getState, setState, clearState };
