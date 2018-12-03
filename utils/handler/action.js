const helpers = require('../helpers');
const { getState, setState, clearState } = require('../state');

const handlers = {

    // Step 1
    setPath: (givenPath, config, fileSystem) => {
        if (helpers.stringIsEmpty(givenPath)) {
            const defaultPath = config.default.path;
            if (helpers.stringIsEmpty(defaultPath)) {
                throw new Error(`The specified default path in 'config.js' is empty`);
            } else {
                if (!fileSystem.pathIsAValidFolder(defaultPath)) {
                    throw new Error(`The specified default path in 'config.js' is not valid (${defaultPath})`);
                } else {
                    setState({ path: defaultPath })
                }
            }
        } else {
            if (!fileSystem.pathIsAValidFolder(givenPath)) {
                throw new Error(`The given path is not valid ('${givenPath}')`);
            } else {
                setState({ path: givenPath });
            }
        }
        return 2;
    },

    // Step 2
    confirmPath: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            return 3
        } else if (confirmation === false) {
            setState({ path: null });
            return 1
        } else {
            throw new Error(`'${answer}' is not a valid answer, please answer with 'yes' or 'no'`)
        }
    },

    // Step 3
    setReplaceables: (answer, config) => {
        answer = answer.toLowerCase();
        if (!helpers.stringIsEmpty(answer)) {
            if (answer === 'files') {
                setState({ files: true });
            } else if (answer === 'folders') {
                setState({ folders: true });
            } else if (answer === 'both') {
                setState({
                    files: true,
                    folders: true
                });
            } else {
                throw new Error(`'${answer}' is not a valid answer, please answer with 'files', 'folders' or 'both'`)
            }
        } else {
            if (config.default.renameFiles || config.default.renameFolders) {
                if (config.default.renameFiles) {
                    setState({ files: true });
                }
                if (config.default.renameFolders) {
                    setState({ folders: true });
                }
            } else {
                throw new Error(`the default action is to rename 'nothing'... please type 'files', 'folders' or 'both' so this program has something to do`)
            }
        }
        return 4
    },

    // Step 4
    confirmReplaceables: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            return 5
        } else if (confirmation === false) {
            setState({
                files: null,
                folders: null
            });
            return 3
        } else {
            throw new Error(`'${answer}' is not a valid answer, please answer with 'yes' or 'no'`)
        }
    },

    // Step 5
    setAction: (answer, config) => {
        const possibleActions = Object.keys(config.actions);
        if (helpers.stringIsEmpty(answer)) {
            throw new Error(`I'm sorry to tell you what to do.. but your action can't be nothing`)
        } else if (!possibleActions.includes(answer)) {
            throw new Error(`'${answer}' is not a valid action (be aware, it's case sensitive)`)
        } else {
            setState({ action: answer });
            if (!config.actions[answer].args) {
                return 8
            } else {
                if (config.actions[answer].args.length === 0) {
                    return 8
                } else {
                    return 6
                }
            }
        }
    },

    // Step 6
    setParameterForAction: (answer) => {
        const args = [...getState().args];
        args.push(answer);
        setState({ args });
        return 7;
    },

    // Step 7
    confirmParameterForAction: (answer, config) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            const amountOfNeededParams = config.actions[getState().action].args.length;
            const amountOfProvidedParams = getState().args.length;
            if (amountOfNeededParams !== amountOfProvidedParams) {
                return 6
            }
            return 8
        } else if (confirmation === false) {
            getState().args.pop();
            return 6
        } else {
            throw new Error(`'${answer}' is not a valid answer, please answer with 'yes' or 'no'`)
        }
    },

    // Step 8
    confirmReplacedNames: (answer, config, fileSystem) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            if (getState().folders) {
                const oldFolderNames = fileSystem.getFolders(getState().path);

                const newFolderNames = oldFolderNames.map(f => config.actions[getState().action].fn(f)(...getState().args));

                getState().backup.folders = [...oldFolderNames];
                const renamedFolders = fileSystem.replaceFolders(getState().path, oldFolderNames, newFolderNames);
                logList('renamed folders:', renamedFolders, console)
            }
            if (getState().files) {
                const oldFileNames = fileSystem.getFiles(getState().path);

                const newFileNames = oldFileNames.map(f => config.actions[getState().action].fn(f)(...getState().args));

                getState().backup.files = [...oldFileNames];
                const renamedFiles = fileSystem.replaceFiles(getState().path, oldFileNames, newFileNames);
                logList('renamed files:', renamedFiles, console)
            }
            return 9
        } else if (confirmation === false) {
            return 5
        } else {
            throw new Error(`'${answer}' is not a valid answer, please answer with 'yes' or 'no'`)
        }
    },

    // Step 9
    undoRestartOrExit: (answer, console, fileSystem) => {
        answer = answer.toLowerCase();
        const undoDis = helpers.levenshteinDistance(answer, 'undo');
        if (undoDis > 0 && undoDis < 3) {
            return 10
        } else if (answer === 'undo') {
            undo(console, fileSystem);
            return 1
        } else if (answer === 'restart') {
            clearState();
            return 1
        } else if (answer === 'exit') {
            return 999
        } else {
            throw new Error(`'${answer}' is not a valid answer, please answer with 'undo', 'restart' or 'exit'`)
        }
    },

    // Step 10
    confirmUndo: (answer, console, fileSystem) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            undo(console, fileSystem);
            return 1
        } else if (confirmation === false) {
            return 9
        } else {
            throw new Error(`'${answer}' is not a valid answer, please answer with 'yes' or 'no'`)
        }
    }
};

function undo(console, fileSystem) {
    console.info('Reverting changes...');
    if (getState().folders) {
        const oldFolderNames = fileSystem.getFolders(getState().path);
        const newFolderNames = getState().backup.folders;
        const renamedFolders = fileSystem.replaceFolders(getState().path, oldFolderNames, newFolderNames);
        logList('Folders:', renamedFolders, console);
    }
    if (getState().files) {
        const oldFileNames = fileSystem.getFiles(getState().path);
        const newFileNames = getState().backup.files;
        const renamedFiles = fileSystem.replaceFiles(getState().path, oldFileNames, newFileNames);
        logList('Files:', renamedFiles, console)
    }
    console.info('The changes have been reverted!');
}

function logList(title, arr, console) {
    console.log(`\n${title}`);
    arr.forEach((f, i) => console.log(i === arr.length - 1 ? '└──' : '├──', f));
}

module.exports = handlers;
