const console = require('better-console');
const fs = require('fs');
const config = require('./config');

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
const actualUtils = {
    stringIsEmpty: (path) => !path.replace(/\s/g, ''),
    confirm: (input) => {
        input = input.toLowerCase();
        if (['', 'y', 'yes'].includes(input)) {
            return true
        } else if (['n', 'no'].includes(input)) {
            return false
        } else {
            return null
        }
    }
};

const handler = {
    setPath: (givenPath) => {
        const pathIsAValidFolder = (path) => {
            const pathExists = fs.existsSync(path);
            if (pathExists) {
                const pathIsAFolder = fs.lstatSync(path).isDirectory();
                return !!pathIsAFolder;
            }
            return false
        };

        if (actualUtils.stringIsEmpty(givenPath)) {
            const defaultPath = config.default.path;
            if (actualUtils.stringIsEmpty(defaultPath)) {
                return `The specified default path in 'config.js' is empty`;
            } else {
                if (!pathIsAValidFolder(defaultPath)) {
                    return `The specified default path in 'config.js' is not valid (${defaultPath})`;
                } else {
                    state.path = defaultPath;
                }
            }
        } else {
            if (!pathIsAValidFolder(givenPath)) {
                return `The given path is not valid ('${givenPath}')`;
            } else {
                state.path = givenPath;
            }
        }
        return null;
    },
    confirmPath: (answer) => {
        const confirmation = actualUtils.confirm(answer);
        if (confirmation === true) {
            return null
        } else if (confirmation === false) {
            state.path = null;
            return 1
        } else if (confirmation === null) {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    confirmReplaceables: (answer,) => {
        const confirmation = actualUtils.confirm(answer);
        if (confirmation === true) {
            return null
        } else if (confirmation === false) {
            state.files = null;
            state.folders = null;
            return 3
        } else if (confirmation === null) {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    setReplaceables: (answer) => {
        answer = answer.toLowerCase();
        if (!actualUtils.stringIsEmpty(answer)) {
            if (answer === 'files') {
                state.files = true;
            } else if (answer === 'folders') {
                state.folders = true;
            } else if (answer === 'both') {
                state.files = true;
                state.folders = true;
            } else {
                return `'${answer}' is not a valid answer, please answer with 'files', 'folders' or 'both'`
            }
        } else {
            if (config.default.renameFiles) state.files = true;
            if (config.default.renameFolders) state.folders = true;
            if (!state.files && !state.folders) {
                return `the default action is to rename 'nothing'... please type 'files', 'folders' or 'both' so this program has something to do`
            }
        }
        return null
    },
    setAction: (answer) => {
        answer = answer.toLowerCase();
        const possibleActions = Object.keys(config.actions);
        if (actualUtils.stringIsEmpty(answer)) {
            return `I'm sorry to tell you what to do.. but your action can't be nothing`
        } else if (!possibleActions.includes(answer)) {
            return `'${answer}' is not a valid action`
        } else {
            state.action = answer;
            if (!config.actions[answer].args) {
                return 8
            } else {
                if (config.actions[answer].args.length === 0) {
                    return 8
                } else {
                    return null
                }
            }
        }
    },
    setParameterForAction: (answer) => {
        state.args.push(answer);
        return null;
    },
    confirmParameterForAction: (answer) => {
        const confirmation = actualUtils.confirm(answer);
        if (confirmation === true) {
            const amountOfNeededParams = config.actions[state.action].args.length;
            const amountOfProvidedParams = state.args.length;
            if (amountOfNeededParams !== amountOfProvidedParams) {
                return 6
            }
            return null
        } else if (confirmation === false) {
            state.args.pop();
            return 6
        } else if (confirmation === null) {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    }
};

const { path, renameFiles, renameFolders } = config.default;

const steps = {
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

module.exports = {
    logInfo: () => console.info(`\nPossible commands: cancel / exit`),
    logError: (message) => console.warn(message + '\n'),
    logQuestion: (step) => console.log(steps[step].question()),
    action: (step, answer) => steps[step].action(answer),
    clearState: () => state = { ...initialState }
};
