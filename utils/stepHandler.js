
const { log, info } = require('better-console');
const helpers = require('./helpers');
const config = require('../config');
const { getState, setState, clearState } = require('./state');
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
                    setState({ path: defaultPath })
                }
            }
        } else {
            if (!fileSystem.pathIsAValidFolder(givenPath)) {
                return `The given path is not valid ('${givenPath}')`;
            } else {
                setState({ path: givenPath });
            }
        }
        return null;
    },
    confirmPath: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            return null
        } else if (confirmation === false) {
            setState({ path: null });
            return 1
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    showListOfFilesAndFoldersBeforeReplacement: (fileSystem = defaultFileSystem) => {
        log('this path contains the following folders and files:');
        fileSystem.getFolders(getState().path).forEach(folder => info(folder));
        fileSystem.getFiles(getState().path).forEach(file => log(file));
    },
    confirmReplaceables: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            return null
        } else if (confirmation === false) {
            setState({
                files: null,
                folders: null
            });
            return 3
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    setReplaceables: (answer) => {
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
                return `'${answer}' is not a valid answer, please answer with 'files', 'folders' or 'both'`
            }
        } else {
            if (config.default.renameFiles) {
                setState({ files: true });
            }
            if (config.default.renameFolders) {
                setState({ folders: true });
            }
            if (!getState().files && !getState().folders) {
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
            setState({ action: answer });
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
        const args = [...getState().args];
        args.push(answer);
        setState({ args });
        return null;
    },
    confirmParameterForAction: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            const amountOfNeededParams = config.actions[getState().action].args.length;
            const amountOfProvidedParams = getState().args.length;
            if (amountOfNeededParams !== amountOfProvidedParams) {
                return 6
            }
            return null
        } else if (confirmation === false) {
            getState().args.pop();
            return 6
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    showListOfReplacedNames: (fileSystem = defaultFileSystem) => {
        if(getState().folders) logList('folders', fileSystem.getFolders(getState().path));
        if(getState().files) logList('files', fileSystem.getFiles(getState().path));

        function logList(title, arr) {
            log(`\n${title}:`);
            log('[OLD]');
            arr.forEach((f, i) => log(i === arr.length - 1 ? '└──' : '├──', f));
            info('[NEW]');
            arr.forEach((f, i) => info(i === arr.length - 1 ? '└──' : '├──', config.actions[getState().action].fn(f)(...getState().args)));
        }
    },
    confirmReplacedNames: (answer, fileSystem = defaultFileSystem) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            if (getState().folders) {
                const oldFolderNames = fileSystem.getFolders(getState().path);
                const newFolderNames = getState().backup.folders.forEach(f => config.actions[getState().action].fn(f)(...getState().args));
                getState().backup.folders = [...oldFolderNames];
                fileSystem.replaceFolders(getState().path, oldFolderNames, newFolderNames);
            }
            if (getState().files) {
                const oldFileNames = fileSystem.getFiles(getState().path);
                const newFileNames = getState().backup.files.forEach(f => config.actions[getState().action].fn(f)(...getState().args));
                getState().backup.files = [...oldFileNames];
                fileSystem.replaceFiles(getState().path, oldFileNames, newFileNames);
            }
            if(getState().folders) logList('renamed folders:', fileSystem.getFolders(getState().path));
            if(getState().files) logList('renamed files:', fileSystem.getFiles(getState().path));

            return null
        } else if (confirmation === false) {
            return 5
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    },
    undoRestartOrExit: (answer) => {
        answer = answer.toLowerCase();
        const undoDis = helpers.levenshteinDistance(answer, 'undo');
        if (undoDis > 0 && undoDis < 3) {
            return null
        } else if (answer === 'undo') {
            undo();
            return 1
        } else if (answer === 'restart') {
            clearState();
            return 1
        } else if (answer === 'exit') {
            return 999
        } else {
            return `'${answer}' is not a valid answer, please answer with 'undo', 'restart' or 'exit'`
        }
    },
    confirmUndo: (answer) => {
        const confirmation = helpers.confirm(answer);
        if (confirmation === true) {
            undo();
            return 1
        } else if (confirmation === false) {
            return 9
        } else {
            return `'${answer}' is not a valid answer, please answer with 'yes' or 'no'`
        }
    }
};

function undo(fileSystem = defaultFileSystem) {
    log('Reverting changes...');
    if (getState().folders) {
        fileSystem.replaceFolders(fileSystem.getFolders(getState().path), [...getState().backup.folders]);
    }
    if (getState().files) {
        fileSystem.replaceFiles(fileSystem.getFiles(getState().path), [...getState().backup.files]);
    }

    if(getState().folders) logList('folders', fileSystem.getFolders(getState().path));
    if(getState().files) logList('files', fileSystem.getFiles(getState().path));

    info('The changes have been reverted!');
}

function logList(title, arr) {
    log(`\n${title}`);
    arr.forEach((f, i) => log(i === arr.length - 1 ? '└──' : '├──', f));
}