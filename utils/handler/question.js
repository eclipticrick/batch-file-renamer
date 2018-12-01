const defaultConfig = require('../../config');
const { getState } = require('../state');

const renameString = (folders, files, phrasings = ['both', 'files', 'folders', 'nothing']) =>
    files && folders ? phrasings[0] :
        files ? phrasings[1] :
            folders ? phrasings[2] :
                phrasings[3];

const defaultPath = config => config.default.path;
const defaultRenameString = config => renameString(config.default.renameFolders, config.default.renameFiles);

const stateRenameString = () => renameString(getState().folders, getState().files, [
    'both files and folders',
    'only the files',
    'only the folders',
    null
]);
const stateRenameString2 = () => renameString(getState().folders, getState().files, [
    'files and folders',
    'files',
    'folders',
    null
]);

const getFirstParamNameWithoutValue = config => config.actions[getState().action].args[getState().args.length];
const getLastParamNameWithValue = config => config.actions[getState().action].args[getState().args.length - 1];
const getLastParamValue = () => getState().args[getState().args.length - 1];

const statePath = () => getState().path;
const stateAction = () => getState().action;


const handler = (currentStepNr, config = defaultConfig) => {
    switch (currentStepNr) {
        case 1: return `Specify a folder where you want to rename files (default: '${defaultPath(config)}')`;
        case 2: return `Is this path correct? (y/n) '${statePath()}'`;
        case 3: return `Do you want to rename files or folders or both? (default: ${defaultRenameString(config)})`;
        case 4: return `So you want to rename ${stateRenameString()} in ${statePath()}? (y/n)`;
        case 5: return `To rename you have certain actions you can perform on the name, choose one.\nactions: '${Object.keys(config.actions).join(`', '`)}'`;
        case 6: return `The action '${stateAction()}' needs a '${getFirstParamNameWithoutValue(config)}'`;
        case 7: return `Is '${getLastParamValue()}' the '${getLastParamNameWithValue(config)}'? (y/n)`;
        case 8: return `These are the new names after the replacement, do you want to continue? (y/n)`;
        case 9: return `
The ${stateRenameString2()} have been successfully renamed!

Type 'undo' to revert the filenames back to what they were
Type 'restart' to rename more files or folders
Type 'exit' to stop this application`;
        case 10: return `Did you mean to type undo? (y/n)`;
        default: return ''
    }
};

module.exports = handler;
