const handler = require('./stepHandler');
const config = require('../config');
const { path, renameFiles, renameFolders } = config.default;
const { getState } = require('./state');


const steps = {
    [1]: {
        question: () => `Specify a folder where you want to rename files (default: '${path}')`,
        action: (answer) => handler.setPath(answer)
    },
    [2]: {
        question: () => `Is this path correct? (y/n) '${getState().path}'`,
        action: (answer) => handler.confirmPath(answer)
    },
    [3]: {
        question: () => `Do you want to rename files or folders or both? (default: ${renameFiles && renameFolders ? 'both' : renameFiles ? 'files' : renameFolders ? 'folders' : 'nothing'} ${handler.showListOfFilesAndFoldersBeforeReplacement() || ''})`,
        action: (answer) => handler.setReplaceables(answer)
    },
    [4]: {
        question: () => `So you want to rename ${getState().files && getState().folders ? 'both files and folders' : getState().files ? 'only the files' : getState().folders ? 'only the folders' : null} in ${getState().path}? (y/n)`,
        action: (answer) => handler.confirmReplaceables(answer)
    },
    [5]: {
        question: () => `To rename you have certain actions you can perform on the name, choose one.\nactions: '${Object.keys(config.actions).join(`', `)}'`,
        action: (answer) => handler.setAction(answer)
    },
    [6]: {
        question: () => `The action '${getState().action}' needs a '${config.actions[getState().action].args[getState().args.length]}'`,
        action: (answer) => handler.setParameterForAction(answer)
    },
    [7]: {
        question: () => `Is '${getState().args[getState().args.length - 1]}' the '${config.actions[getState().action].args[getState().args.length - 1]}' (y/n)`,
        action: (answer) => handler.confirmParameterForAction(answer)
    },
    [8]: {
        question: () => `These are the new names after the replacement, do you want to continue? (y/n) ${handler.showListOfReplacedNames() || ''}`,
        action: (answer) => handler.confirmReplacedNames(answer)
    },
    [9]: {
        question: () => `
The ${getState().files && getState().folders ? 'files and folders' : getState().files ? 'files' : getState().folders ? 'folders' : null} have been successfully renamed!

Type 'undo' to revert the filenames back to what they were
Type 'restart' to rename more files or folders
Type 'exit' to stop this application
        `,
        action: (answer) => handler.undoRestartOrExit(answer)
    },
    [11]: {
        question: () => `Did you mean to type undo? (y/n)`,
        action: (answer) => handler.confirmUndo(answer)
    },
    [999]: {
        question: () => ``,
        action: () => process.exit()
    },
};

const getStep = (nr) => {
    if (steps[nr]) {
        return steps[nr];
    } else {
        return steps[999];
    }
};

module.exports = { steps, getStep };