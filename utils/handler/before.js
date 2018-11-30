const { log, info } = require('better-console');
const config = require('../../config');
const { getState } = require('../state');
const defaultFileSystem = require('../fileSystem');

const handlers = {

    // Before step 3
    showListOfFilesAndFoldersBeforeReplacement: (fileSystem = defaultFileSystem) => {
        log('this path contains the following folders and files:');
        fileSystem.getFolders(getState().path).forEach(folder => info(folder));
        fileSystem.getFiles(getState().path).forEach(file => log(file));
    },

    // Before step 8
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
    }
};

module.exports = handlers;
