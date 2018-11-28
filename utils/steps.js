const handler = require('./stepHandler');
const config = require('../config');
const { path, renameFiles, renameFolders } = config.default;
const { state } = require('./state');

module.exports = {
    [1]: {
        question: () => `Specify a folder where you want to rename files (default: '${path}')`,
        action: (answer) => handler.setPath(answer)
    },
    [2]: {
        question: () => `Is this path correct? (y/n) '${state.path}'`,
        action: (answer) => handler.confirmPath(answer)
    },
    [3]: {
        question: () => `Do you want to rename files or folders or both? (default: ${renameFiles && renameFolders ? 'both' : renameFiles ? 'files' : renameFolders ? 'folders' : 'nothing'})`,
        action: (answer) => handler.setReplaceables(answer)
    },
    [4]: {
        question: () => `So you want to rename ${state.files && state.folders ? 'both files and folders' : state.files ? 'only the files' : state.folders ? 'only the folders' : null} in ${state.path}? (y/n)`,
        action: (answer) => handler.confirmReplaceables(answer)
    },
    [5]: {
        question: () => `To rename you have certain actions you can perform on the name, choose one.\nactions: '${Object.keys(config.actions).join(`', `)}'`,
        action: (answer) => handler.setAction(answer)
    },
    [6]: {
        question: () => `The action '${state.action}' needs a '${config.actions[state.action].args[state.args.length]}'`,
        action: (answer) => handler.setParameterForAction(answer)
    },
    [7]: {
        question: () => `Is '${state.args[state.args.length - 1]}' the '${config.actions[state.action].args[state.args.length - 1]}'`,
        action: (answer) => handler.confirmParameterForAction(answer)
    },
    [8]: {
        question: () => `This is what it will look like after? agree?? (y/n)`,
        action: (answer) => console.log('not implemented yet')
    },
    [9]: {
        question: () => `There ya go, done`,
        action: (answer) => console.log('not implemented yet')
    },
    [10]: {
        question: () => `
            Type 'undo' to revert the filenames back to what they were
            Type 'restart' to rename more files or folders
            Type 'exit' to stop this application
        `,
        action: (answer) => console.log('not implemented yet')
    },
};
