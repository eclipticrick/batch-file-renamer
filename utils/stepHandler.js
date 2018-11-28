const fs = require('fs');
const helpers = require('./helpers');
const config = require('../config');
const { state } = require('./state');

module.exports = {
    setPath: (givenPath) => {
        const pathIsAValidFolder = (path) => {
            const pathExists = fs.existsSync(path);
            if (pathExists) {
                const pathIsAFolder = fs.lstatSync(path).isDirectory();
                return !!pathIsAFolder;
            }
            return false
        };

        if (helpers.stringIsEmpty(givenPath)) {
            const defaultPath = config.default.path;
            if (helpers.stringIsEmpty(defaultPath)) {
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
        const confirmation = helpers.confirm(answer);
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
        const confirmation = helpers.confirm(answer);
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
        if (!helpers.stringIsEmpty(answer)) {
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
        if (helpers.stringIsEmpty(answer)) {
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
        const confirmation = helpers.confirm(answer);
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
