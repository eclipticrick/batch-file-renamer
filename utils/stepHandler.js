
const { log, info } = require('better-console');
const helpers = require('./helpers');
const config = require('../config');
const { state, clearState } = require('./state');
const defaultFileSystem = require('./fileSystem');

module.exports = {
    setPath: (givenPath, fileSystem = defaultFileSystem) => {
        if (helpers.stringIsEmpty(givenPath)) {
            const defaultPath = config.default.path;
            if (helpers.stringIsEmpty(defaultPath)) {
                return `The specified default path in 'config.js' is empty`;
            } else {
                if (!fileSystem.pathIsAValidFolder(defaultPath)) {
                    return `The specified default path in 'config.js' is not valid (${defaultPath})`;
                } else {
                    state.path = defaultPath;
                }
            }
        } else {
            if (!fileSystem.pathIsAValidFolder(givenPath)) {
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
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    showListOfFilesAndFoldersBeforeReplacement: (fileSystem = defaultFileSystem) => {
        log('this path contains the following folders and files:');
        fileSystem.getFolders(state.path).forEach(folder => info(folder));
        fileSystem.getFiles(state.path).forEach(file => log(file));
    },
    confirmReplaceables: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            return null
        } else if (confirmation === false) {
            state.files = null;
            state.folders = null;
            return 3
        } else {
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
        const possibleActions = Object.keys(config.actions);
        if (helpers.stringIsEmpty(answer)) {
            return `I'm sorry to tell you what to do.. but your action can't be nothing`
        } else if (!possibleActions.includes(answer)) {
            return `'${answer}' is not a valid action (be aware, it's case sensitive)`
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
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    showListOfReplacedNames: (fileSystem = defaultFileSystem) => {
        if(state.folders) logList('folders', fileSystem.getFolders(state.path));
        if(state.files) logList('files', fileSystem.getFiles(state.path));

        function logList(title, arr) {
            log(`\n${title}:`);
            log('[OLD]');
            arr.forEach((f, i) => log(i === arr.length - 1 ? '└──' : '├──', f));
            info('[NEW]');
            arr.forEach((f, i) => info(i === arr.length - 1 ? '└──' : '├──', config.actions[state.action].fn(f)(...state.args)));
        }
    },
    confirmReplacedNames: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {

            // TODO
            // Do everything
            // backup
            // replace

            return null
        } else if (confirmation === false) {
            clearState();
            return 1
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    showListOfResults: (fileSystem = defaultFileSystem) => {
        if(state.folders) logList('renamed folders:', fileSystem.getFolders(state.path));
        if(state.files) logList('renamed files:', fileSystem.getFiles(state.path));

        return null;

        function logList(title, arr) {
            log(`\n${title}`);
            arr.forEach((f, i) => log(i === arr.length - 1 ? '└──' : '├──', f));
        }
    },
    undoRestartOrExit: (answer) => {
        // TODO
    },
};
